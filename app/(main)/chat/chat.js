'use client';

import {useEffect, useRef, useState} from 'react';
import {useUser} from '@clerk/nextjs';
import useChatStore from '@/hooks/useChatStore';
import MessagesList from './MessagesList';
import {Button} from '@/components/ui/button';
import {Loader2, Paperclip} from 'lucide-react';
import {io} from 'socket.io-client';
import {useAlert} from "@/components/alert-context";
import {insertMessage} from "@/actions/message-actions";
import MessageInput from './MessageInput';

const socket = io('http://localhost:3001', {
    closeOnBeforeunload: true,
    reconnection: true,
    reconnectionDelay: 500,
    auth: {
        userId: null,
    },
});

const Chat = ({channelName}) => {
    const {showAlert} = useAlert();
    const {user} = useUser();

    // Chat state
    const {
        selectedGroupID,
        selectedChannel,
        messagesList,
        addToMessagesList,
        setInputMessage,
        clearMessages,
        updateMessage,
        deleteMessage,
    } = useChatStore();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    // Scroll to bottom
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        if (user?.id) {
            socket.auth.userId = user.id;
            socket.disconnect().connect();
        }
    }, [user]);

    useEffect(() => {
        socket.on('receive_msg', (newMessage) => addToMessagesList([newMessage]));
        return () => socket.off('receive_msg');
    }, [addToMessagesList]);

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const response = await fetch(`/api/chat/${selectedGroupID}/${selectedChannel.channel_num}`);
                const data = await response.json();

                socket.emit('join_room', selectedGroupID + selectedChannel.channel_num);
                clearMessages();
                addToMessagesList(data.messages);
            } catch (error) {
                showAlert({message: 'Error loading messages', severity: 'error'});
            } finally {
                setIsLoadingMessages(false);
            }
        };

        if (selectedGroupID && selectedChannel) fetchMessages();
        return () => socket.emit('leave_room', selectedGroupID, selectedChannel?.channel_num);
    }, [selectedGroupID, selectedChannel, clearMessages, addToMessagesList, showAlert]);

    useEffect(scrollToBottom, [messagesList]);

    const handleSendMessage = async (message) => {
        if (!message.trim()) {
            showAlert({message: 'Message cannot be empty.', severity: 'warning'});
            return;
        }

        try {
            const newMessage = await insertMessage(selectedGroupID, selectedChannel.channel_num, message, 'message');
            addToMessagesList([{username: user.username, ...newMessage.data}]);
            socket.emit('send_msg', {
                ...newMessage.data,
                username: user.username,
                img_url: user.imageUrl,
                roomId: selectedGroupID + selectedChannel.channel_num,
            });
        } catch (error) {
            showAlert({message: 'Error sending message', severity: 'error'});
        }
    };

    const handleEmojiSelect = (emoji) => {
        setInputMessage(prev => prev + emoji.native);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleMessageUpdate = (message_id, content) => {
        if (content !== null) {
            updateMessage(message_id, content);
            socket.emit('update_msg', selectedGroupID.toString() + selectedChannel.channel_num.toString(), message_id, content);
        } else {
            deleteMessage(message_id);
            socket.emit('update_msg', selectedGroupID.toString() + selectedChannel.channel_num.toString(), message_id);
        }
    };

    if (!selectedChannel) {
        return <div className="flex items-center justify-center h-full text-gray-500">Select a channel to start
                                                                                      messaging</div>;
    }

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <div className="border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold truncate">{channelName}</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => document.getElementById('file-input').click()}>
                        <Paperclip size={20} />
                    </Button>
                </div>
            </div>

            {!isLoadingMessages ? (
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    <MessagesList
                        messages={messagesList}
                        onMessageUpdate={handleMessageUpdate}
                    />
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                <div className="flex-grow flex justify-center items-center">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            )}

            <div className="border-t p-4">
                <MessageInput
                    onSubmit={handleSendMessage}
                    onEmojiSelect={handleEmojiSelect}
                    placeholder={`Message #${channelName}`}
                />
                <input type="file" id="file-input" hidden onChange={handleFileChange} />
                {selectedFile && <p className="mt-2 text-sm text-gray-500">Selected file: {selectedFile.name}</p>}
            </div>
        </div>
    );
};

export default Chat;


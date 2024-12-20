'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import useSWR from 'swr';
import {useUser} from '@clerk/nextjs';
import useChatStore from '@/hooks/useChatStore';
import MessagesList from './MessagesList';
import {Button} from '@/components/ui/button';
import {Loader2, Paperclip} from 'lucide-react';
import {io} from 'socket.io-client';
import {useAlert} from '@/components/alert-context';
import {insertMessage} from '@/actions/message-actions';
import MessageInput from '@/app/(main)/chat/MessageInput';

// Create socket connection function
const createSocketConnection = (userId) => {
    return io(process.env.NEXT_PUBLIC_RAILWAY_WS_HOST, {
        closeOnBeforeunload: true,
        reconnection: true,
        reconnectionDelay: 500,
        autoConnect: false,
        auth: {userId},
    });
};

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

const Chat = ({disableInput, userRole}) => {
    const {showAlert} = useAlert();
    const {user} = useUser();
    // Chat store state
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

    // State management
    const [roomId, setRoomId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [socket, setSocket] = useState(null);

    // Refs for scroll management
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // SWR for fetching messages
    const {data: fetchedMessages, error, isLoading} = useSWR(
        selectedGroupID && selectedChannel
            ? `/api/chat/${selectedGroupID}/${selectedChannel.channel_num}`
            : null,
        fetcher
    );

    // Scroll to bottom function with options
    const scrollToBottom = useCallback((behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({behavior});
    }, []);

    // Effect for populating messages list with SWR data
    useEffect(() => {
        if (fetchedMessages && fetchedMessages.messages) {
            clearMessages();
            addToMessagesList(fetchedMessages.messages);
            setTimeout(() => scrollToBottom('auto'), 100);
        }
        if (error) {
            showAlert({message: 'Error loading messages', severity: 'error'});
        }
    }, [fetchedMessages, error, clearMessages, addToMessagesList, scrollToBottom]);

    // Socket connection effect
    useEffect(() => {
        if (user?.id && roomId) {
            const newSocket = createSocketConnection(user.id);
            newSocket.connect();
            newSocket.emit('join_room', roomId);
            setSocket(newSocket);

            // Socket event listeners
            const handleReceiveMsg = (newMessage) => {
                addToMessagesList([newMessage]);
                setTimeout(() => scrollToBottom(), 100);
            };

            const handleUpdateMsg = (messageId, content) => {
                if (content) {
                    updateMessage(messageId, content);
                } else {
                    deleteMessage(messageId);
                }
            };

            newSocket.on('receive_msg', handleReceiveMsg);
            newSocket.on('update_msg', handleUpdateMsg);

            // Cleanup function
            return () => {
                newSocket.off('receive_msg', handleReceiveMsg);
                newSocket.off('update_msg', handleUpdateMsg);
                newSocket.emit('leave_room', roomId);
                newSocket.disconnect();
            };
        }
    }, [user, roomId, addToMessagesList, updateMessage, deleteMessage, scrollToBottom]);

    // Room ID effect
    useEffect(() => {
        if (selectedGroupID && selectedChannel) {
            setRoomId(`group-${selectedGroupID}-room-${selectedChannel.channel_num}`);
        }
    }, [selectedGroupID, selectedChannel]);

    // Message sending handler
    const handleSendMessage = async (message) => {
        if (!message.trim()) {
            showAlert({message: 'Message cannot be empty.', severity: 'warning'});
            return;
        }

        try {
            const newMessage = await insertMessage(
                selectedGroupID,
                selectedChannel.channel_num,
                message,
                'message'
            );

            addToMessagesList([
                {
                    username: user.username,
                    ...newMessage.data,
                },
            ]);

            // Emit message to socket
            socket?.emit('send_msg', {
                ...newMessage.data,
                sender_id: null,
                username: user.username,
                img_url: user.imageUrl,
                roomId,
            });

            setTimeout(() => scrollToBottom(), 100);
        } catch (error) {
            showAlert({message: 'Error sending message', severity: 'error'});
        }
    };

    // File change handler
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Message update handler
    const handleMessageUpdate = (messageId, content) => {
        if (content !== null) {
            updateMessage(messageId, content);
            socket?.emit('update_msg', roomId, messageId, content);
        } else {
            deleteMessage(messageId);
            socket?.emit('update_msg', roomId, messageId);
        }
    };

    // Render loading or chat interface
    if (!selectedChannel) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a channel to start messaging
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            {/* Channel header */}
            <div className="border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold truncate">
                    {selectedChannel.channel_name || 'Select a channel'}
                </h2>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <Paperclip size={20} />
                    </Button>
                </div>
            </div>

            {/* Messages container */}
            {!isLoading ? (
                <div
                    ref={messagesContainerRef}
                    className="flex-grow overflow-y-auto p-4 space-y-4"
                >
                    <MessagesList
                        messages={messagesList}
                        onMessageUpdate={handleMessageUpdate}
                        userRole={userRole}
                    />
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                <div className="flex-grow flex justify-center items-center">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            )}

            {/* Message input */}
            <div className="border-t p-4">
                <MessageInput
                    disabled={disableInput}
                    onSubmit={handleSendMessage}
                    placeholder={`Message #${selectedChannel.channel_name}`}
                />
                <input
                    type="file"
                    id="file-input"
                    hidden
                    onChange={handleFileChange}
                />
                {selectedFile && (
                    <p className="mt-2 text-sm text-gray-500">
                        Selected file: {selectedFile.name}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Chat;

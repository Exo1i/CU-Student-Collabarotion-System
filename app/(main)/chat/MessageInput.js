'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {ChevronDown, Send, Smile} from 'lucide-react';
import Picker from '@emoji-mart/react';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import MessageTypeIndicator from './MessageTypeIndicator';

const MessageInput = ({onSubmit, disabled, onEmojiSelect, userRole, onEditChannel, onDeleteChannel}) => {
    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messageType, setMessageType] = useState('message');

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSubmit({content: input, type: messageType});
            setInput('');
            setMessageType('message'); // Reset message type after sending
        }
    };

    const handleEmojiSelect = (emoji) => {
        setInput((prev) => prev + emoji.native);
        onEmojiSelect?.(emoji);
    };

    const isInstructorOrAdmin = userRole === 'instructor' || userRole === 'admin';

    const messageTypes = [
        {value: 'message', label: 'Message'},
        {value: 'announcement', label: 'Announcement'},
        {value: 'update', label: 'Update'},
        {value: 'alert', label: 'Alert'},
        {value: 'resource', label: 'Resource'},
    ];

    return (
        <div className="flex flex-col space-y-2">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                {isInstructorOrAdmin && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                                <MessageTypeIndicator type={messageType} />
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                            <div className="flex flex-col space-y-1">
                                {messageTypes.map((type) => (
                                    <Button
                                        key={type.value}
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => setMessageType(type.value)}
                                    >
                                        <MessageTypeIndicator type={type.value} />
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                )}

                <div className="flex-grow flex items-center space-x-2 relative">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={handleChange}
                        disabled={disabled}
                        className="flex-grow"
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        disabled={disabled}
                    >
                        <Smile size={20} />
                    </Button>

                    <Button type="submit" variant="solid" size="icon" disabled={disabled || !input.trim()}>
                        <Send size={20} />
                    </Button>

                    {showEmojiPicker && (
                        <div className="absolute bottom-12 right-0 bg-white shadow-md rounded-md z-10">
                            <Picker
                                autoFocus={true}
                                onClickOutside={() => setShowEmojiPicker(false)}
                                onEmojiSelect={handleEmojiSelect}
                                theme="light"
                            />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default MessageInput;


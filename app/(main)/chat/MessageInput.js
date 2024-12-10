'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Send, Smile} from 'lucide-react';
import Picker from '@emoji-mart/react';

const MessageInput = ({onSubmit, disabled, onEmojiSelect}) => {
    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSubmit(input);
            setInput('');
        }
    };

    const handleEmojiSelect = (emoji) => {
        setInput((prev) => prev + emoji.native);
        onEmojiSelect?.(emoji); // Optional chaining in case `onEmojiSelect` is not provided.
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 relative">
            {/* Input Field */}
            <Input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={handleChange}
                disabled={disabled}
                className="flex-grow"
            />

            {/* Emoji Picker Toggle */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                disabled={disabled}
            >
                <Smile size={20} />
            </Button>

            {/* Send Button */}
            <Button type="submit" variant="solid" size="icon" disabled={disabled || !input.trim()}>
                <Send size={20} />
            </Button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-12 right-0  bg-white shadow-md rounded-md z-10">
                    <Picker
                        autoFocus={true}
                        onClickOutside={() => setShowEmojiPicker(false)}
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                    />
                </div>
            )}
        </form>
    );
};

export default MessageInput;

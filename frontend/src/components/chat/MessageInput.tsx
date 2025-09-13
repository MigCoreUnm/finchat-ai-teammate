import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
    onSendMessage: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-blue-100">
            <div className="relative">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ask me anything about your finances..."
                    className="pr-12"
                />
                <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2">
                    <SendIcon className="w-4 h-4" />
                </Button>
            </div>
        </form>
    );
};

// SVG Icon for the send button
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

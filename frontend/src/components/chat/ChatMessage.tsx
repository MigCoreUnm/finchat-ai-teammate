import React from 'react';
import { cn } from '@/lib/utils'; // from shadcn

interface ChatMessageProps {
  source: 'AI' | 'User';
  children: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ source, children }) => {
  const isAI = source === 'AI';

  return (
    <div className={cn('flex items-start gap-3', isAI ? 'justify-start' : 'justify-end',)}>
      {isAI && <img src="/bot-avatar.svg" className="w-8 h-8 rounded-full" />}
      <div
        className={cn(
          'p-3 rounded-lg max-w-lg',
          isAI ? 'bg-blue-50 text-blue-900 rounded-tl-none shadow-2xl' : 'bg-blue-500 text-white rounded-br-none'
        )}
      >
        {children}
      </div>
    </div>
  );
};

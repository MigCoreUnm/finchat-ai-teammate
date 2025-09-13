import { useState, useEffect } from "react";
import type { Transaction, UserGoal, SavingTip } from "@/types";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { MessageInput } from "@/components/chat/MessageInput";
import { SavingTipCard } from "@/components/chat/TipCard";

// Mock data imports for building the UI
import { mockGoal, mockTip, mockSummary } from "@/api/MockData";

// Define the structure of a message in the chat
interface Message {
  id: string;
  source: "AI" | "User";
  content: React.ReactNode; // Content can be a string or a component like a card
}

interface ChatPageProps {
  initialTransactions: Transaction[];
}

export const ChatPage: React.FC<ChatPageProps> = ({ initialTransactions }) => {
  // We'll manage the conversation history in this state
  const [messages, setMessages] = useState<Message[]>([]);

  // When the component loads, we'll create the initial set of messages
  useEffect(() => {
    const initialAiMessages: Message[] = [
      {
        id: "intro-1",
        source: "AI",
        content: `Okay, I've analyzed your ${initialTransactions.length} transactions. Here's a quick summary.`,
      },
      {
        id: "summary-1",
        source: "AI",
        content: mockSummary.insight_message,
      },
      // This is where we showcase the "wow" feature
      {
        id: "tip-1",
        source: "AI",
        content: <SavingTipCard tip={mockTip} />,
      },
       {
        id: "goal-prompt",
        source: "AI",
        content: "To help you stay on track, what's your main financial goal right now? (e.g., 'Save $500 for a vacation')",
      },
    ];
    setMessages(initialAiMessages);
  }, [initialTransactions]);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: new Date().toISOString(),
      source: 'User',
      content: text,
    };
    // In a real app, you'd send this to the backend
    // For now, we just add it to the chat
    setMessages(prev => [...prev, userMessage]);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-screen max-w-7xl mx-auto">
      {/* Main Chat Area */}
      <div className="md:col-span-2 lg:col-span-3 flex flex-col h-screen bg-white">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} source={msg.source}>
              {msg.content}
            </ChatMessage>
          ))}
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:block md:col-span-1 lg:col-span-1 bg-slate-50 border-l border-blue-100 p-6">
        <Sidebar goal={mockGoal} summary={mockSummary} />
      </div>
    </div>
  );
};

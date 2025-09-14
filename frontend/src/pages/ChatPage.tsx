import React, { useEffect, useState, useMemo } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { fetchFinancialContext, addPolicy, addTransaction } from '@/api/usersApi';
import { uploadTransactions } from '@/api/transactionAPI';
import type { FinancialContext, Transaction, Policy } from '@/types';

// --- Component Imports ---
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Dashboard } from '@/components/DashBoard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AddPolicyForm } from './GoalsForm';
import { AddTransactionForm } from './TransactionForm';
import { MessageInput } from '@/components/chat/MessageInput';
import { ChatMessage , type Message} from '@/components/chat/ChatMessage';
import { ProgressDonut } from '@/components/ui/ProgressDonut';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, FileText, Lightbulb, PlusCircle } from 'lucide-react';

// Helper to get an icon for a transaction category for visual flair
const getCategoryIcon = (category?: string) => {
    switch (category) {
        case 'Food & Drink': return '🍔';
        case 'Transport': return '🚗';
        case 'Shopping': return '🛍️';
        case 'Entertainment': return '🎬';
        case 'Income': return '💰';
        case 'Housing': return '🏠';
        default: return '💸';
    }
};

// --- Mock Recommendations for Demo ---
const mockRecommendations = [
    {
        title: "Save on your next coffee",
        text: "I noticed you go to Starbucks. The Philz Coffee two blocks away is often cheaper and could save you on your daily brew.",
    },
    {
        title: "Activate a grocery discount",
        text: "Since you frequently shop at Safeway, check their app for a 5% discount on produce this week that you can activate.",
    },
    {
        title: "Check your phone plan perks",
        text: "Your Netflix subscription just renewed. Many phone plans include a free subscription—it's worth checking to avoid paying twice!",
    },
    {
        title: "Rideshare savings",
        text: "Your spending on Lyft was high last month. Consider a public transit pass for your daily commute to save significantly.",
    },
];

const mockInitialMessages: Message[] = [
    {
        sender: 'AI',
        text: `Welcome, Miguel! I've analyzed your financial context. How can I help you today?`,
        timestamp: Date.now() - 3000,
    },
    {
        sender: 'User',
        text: 'How is my spending looking this month?',
        timestamp: Date.now() - 2000,
    },
    {
        sender: 'AI',
        text: 'Your spending is generally on track, but I did notice you have a high number of transactions in the "Food & Drink" category. This is your biggest area for potential savings.',
        timestamp: Date.now() - 1000,
    }
];

export const ChatPage: React.FC = () => {
  const { user, isLoaded: userIsLoaded } = useUser();
  
  // --- STATE MANAGEMENT ---
  const [context, setContext] = useState<FinancialContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const loadContext = async () => {
      if (!userIsLoaded || !user) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFinancialContext(user.id);

        // --- INJECT MOCK DATA FOR DEMO ---
        if (data && data.policies.length === 0) {
            data.policies.push({
                policy_id: 'mock-policy-1',
                description: 'Coffee Budget',
                limit_amount: 50,
                current_spending: 35.50,
                timeframe: 'monthly',
                target_category: 'Food & Drink',
            });
        }
        
        setContext(data);
        // Use the new mock conversation
        setMessages(mockInitialMessages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load financial data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadContext();
  }, [user, userIsLoaded]);

  // --- EVENT HANDLERS ---
  const handleSendMessage = async (text: string) => {
    const newMessage: Message = { sender: 'User', text, timestamp: Date.now() };
    setMessages(prev => [...prev, newMessage]);
    setIsAiTyping(true);

    // Simulate AI response for demo
    setTimeout(() => {
        const aiResponse: Message = { sender: 'AI', text: "That's a great question! Based on your data, here is what I found...", timestamp: Date.now() + 1 };
        setMessages(prev => [...prev, aiResponse]);
        setIsAiTyping(false);
    }, 1500);
  };

  const handleSavePolicy = async (policyData: Omit<Policy, 'policy_id' | 'current_spending' | 'timeframe'>) => {
    if (!user) return;
    setIsSubmitting(true);
    const originalContext = context;
    setIsAddPolicyOpen(false);
    try {
      const updatedContext = await addPolicy(user.id, policyData);
      setContext(updatedContext);
    } catch (error) {
      console.error("Failed to save policy:", error);
      setContext(originalContext);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (!user) return;
    setIsSubmitting(true);
    const originalContext = context;
    setIsAddTransactionOpen(false);
    try {
      const updatedContext = await addTransaction(user.id, transactionData);
      setContext(updatedContext);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setContext(originalContext);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileSave = async (file: File) => {
      if (!user) return;
      setIsSubmitting(true);
      setIsAddTransactionOpen(false);
      try {
          const updatedContext = await uploadTransactions(file, user.id);
          setContext(updatedContext);
      } catch (error) {
          console.error("Failed to upload file:", error);
          setError("Failed to process the uploaded file. Please check the format.");
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- RENDER STATES ---
  if (isLoading || !userIsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center p-4">
        <ProgressDonut progress={50} />
        <p className="text-blue-800 font-semibold mt-4 animate-pulse">Analyzing your financial context...</p>
      </div>
    );
  }

  if (error || !context) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center p-4">
        <h2 className="text-xl font-bold text-destructive mb-4">Error Loading Data</h2>
        <p className="text-red-600 mb-6">{error || "Context could not be loaded."}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <>
      <div className="grid h-screen grid-cols-[350px_1fr_350px] bg-white font-sans">
        
        <aside className="hidden md:flex flex-col border-r p-6 bg-slate-50 min-h-0">
          <div className='flex justify-between items-center mb-4'>
              <h3 className="text-2xl font-bold text-blue-900">Transactions</h3>
              <Button size="sm" variant="ghost" onClick={() => setIsAddTransactionOpen(true)}>
                  <PlusCircle size={16} className="mr-2" /> Add
              </Button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 -mr-3 pr-3">
            {context.transactions.map((t) => (
                <Card key={t.id} className='p-3'>
                    <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-3'>
                            <span className='text-xl bg-white p-2 rounded-full shadow-inner'>{getCategoryIcon(t.category)}</span>
                            <div>
                                <p className='font-bold text-blue-900'>{t.description}</p>
                                <p className='text-xs text-slate-500'>{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <p className={`font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-slate-700'}`}>
                            {t.amount < 0 && '-'}${Math.abs(t.amount).toFixed(2)}
                        </p>
                    </div>
                </Card>
            ))}
          </div>
        </aside>

        <main className="flex flex-col flex-1 overflow-hidden">
            <PanelGroup direction="vertical">
                <Panel defaultSize={65} minSize={30} className="flex flex-col overflow-hidden">
                    <Dashboard />
                </Panel>
                <PanelResizeHandle className="h-2 bg-slate-100 data-[resize-handle-state=hover]:bg-blue-500 data-[resize-handle-state=drag]:bg-blue-500 transition-colors" />
                <Panel defaultSize={35} minSize={20} className="flex flex-col bg-[url('/grid-bg.svg')] bg-cover">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg) => (
                            <ChatMessage key={msg.timestamp} source={msg.sender}>
                                {msg.text}
                            </ChatMessage>
                        ))}
                        {messages.length === 3 && ( // Show prompts after the initial conversation
                            <div className="flex flex-wrap gap-2 pt-4">
                                <Button variant="outline" size="sm" onClick={() => handleSendMessage("Summarize my spending this month.")}>Summarize my spending</Button>
                                <Button variant="outline" size="sm" onClick={() => handleSendMessage("Where can I save the most money?")}>Where can I save money?</Button>
                                <Button variant="outline" size="sm" onClick={() => handleSendMessage("Show my largest purchases.")}>Show largest purchases</Button>
                            </div>
                        )}
                        {isAiTyping && (
                            <ChatMessage source="AI">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                                </div>
                            </ChatMessage>
                        )}
                    </div>
                    <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                </Panel>
            </PanelGroup>
        </main>

        <aside className="hidden md:flex flex-col border-l p-6 bg-slate-50 min-h-0">
          <div className='flex justify-between items-center mb-6'>
              <h3 className="text-2xl font-bold text-blue-900">Insights</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6">
              <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-800"><ShieldCheck size={20} /> Spending Policies</h4>
                    <Button size="sm" variant="ghost" onClick={() => setIsAddPolicyOpen(true)}>
                        <PlusCircle size={16} className="mr-2" /> Add
                    </Button>
                  </div>
                  {context.policies.length > 0 ? (
                      context.policies.map((policy) => {
                          const progress = (policy.current_spending / policy.limit_amount) * 100;
                          return (
                              <Card key={policy.policy_id} className="mb-4">
                                  <CardContent className="p-4 flex items-center gap-4">
                                      <ProgressDonut progress={progress} size={60} strokeWidth={8} subtext={`of $${policy.limit_amount.toFixed(0)}`} />
                                      <div>
                                          <p className="font-bold text-blue-900">{policy.description}</p>
                                          <p className="text-xs text-blue-700/80">${policy.current_spending.toFixed(0)} spent</p>
                                      </div>
                                  </CardContent>
                              </Card>
                          )
                      })
                  ) : <p className="text-sm text-slate-500 pl-2">No active policies set.</p>}
              </div>
              <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-800"><Lightbulb size={20} /> Recommendations</h4>
                  {mockRecommendations.map((rec, index) => (
                    <Card key={index} className="bg-blue-50/30 mb-3">
                        <CardContent className="p-4 text-sm">
                            <p className="font-bold text-blue-900">{rec.title}</p>
                            <p className="text-blue-800/90">{rec.text}</p>
                        </CardContent>
                    </Card>
                  ))}
              </div>
          </div>
        </aside>
      </div>

      <Dialog open={isAddPolicyOpen} onOpenChange={setIsAddPolicyOpen}>
          <DialogContent className="bg-slate-50 border-none shadow-2xl shadow-blue-500/20">
              <DialogHeader className="p-6 pb-4">
                  <DialogTitle className="flex items-center gap-2 text-xl text-blue-900 font-bold"><ShieldCheck size={22} /> Add a New Spending Policy</DialogTitle>
                  <DialogDescription>Set a monthly budget for a specific category to monitor your spending.</DialogDescription>
              </DialogHeader>
              <div className="p-6 pt-0"><AddPolicyForm onClose={() => setIsAddPolicyOpen(false)} onSave={handleSavePolicy} isLoading={isSubmitting} /></div>
          </DialogContent>
      </Dialog>

      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
          <DialogContent className="bg-slate-50 border-none shadow-2xl shadow-blue-500/20">
              <DialogHeader className="p-6 pb-4">
                  <DialogTitle className="flex items-center gap-2 text-xl text-blue-900 font-bold"><FileText size={22} /> Add New Transactions</DialogTitle>
                  <DialogDescription>Add a single expense or upload a CSV for bulk entries.</DialogDescription>
              </DialogHeader>
              <div className="p-6 pt-0">
                <AddTransactionForm onClose={() => setIsAddTransactionOpen(false)} onSave={handleSaveTransaction} onFileSave={handleFileSave} isLoading={isSubmitting} />
              </div>
          </DialogContent>
      </Dialog>
    </>
  );
};


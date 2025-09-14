import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { WelcomePage } from "./pages/WelcomePage";
import { ChatPage } from "./pages/ChatPage";
import { LoginPage } from "./pages/LoginPage";
import type { Transaction } from "./types";
import { uploadTransactions } from "./api/transactionAPI";
import { Button } from "./components/ui/Button";

function App() {
  // --- Main Application Logic ---
  const MainApp = () => {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await uploadTransactions(file);
        setTransactions(response.transactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setTransactions(null);
      } finally {
        setIsLoading(false);
      }
    };

    const handleReset = () => {
      setTransactions(null);
      setError(null);
    };

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center p-4">
          <h2 className="text-2xl font-bold text-destructive mb-4">Oops! Something went wrong.</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={handleReset}>Try Again</Button>
        </div>
      );
    }

    return (
      <main>
        {transactions ? (
          <ChatPage initialTransactions={transactions} />
        ) : (
          <WelcomePage onFileUpload={handleFileUpload} isLoading={isLoading} />
        )}
      </main>
    );
  };

  // --- Authentication Router ---
  return (
    <>
      <SignedOut>
        <LoginPage />
      </SignedOut>
      <SignedIn>
        <header className="absolute top-4 right-4 z-10">
          <UserButton />
        </header>
        <MainApp />
      </SignedIn>
    </>
  );
}

export default App;


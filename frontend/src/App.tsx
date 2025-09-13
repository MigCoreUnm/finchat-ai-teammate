import { useState } from "react";
import { ChatPage } from "./pages/ChatPage";
import { WelcomePage } from "./pages/WelcomePage";
import { TestComponents } from "./pages/TestComponents";
import type { Transaction } from "./types";

function App() {
  // This state will hold the transactions once they are uploaded.
  // We use its existence to decide which page to show.
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  // This function will be passed to the WelcomePage.
  // When the upload is successful, it will set the transactions
  // and trigger the app to render the ChatPage.
  const handleUploadSuccess = (uploadedTransactions: Transaction[]) => {
    setTransactions(uploadedTransactions);
  };

  return (
    <main className="bg-slate-50 font-sans min-h-screen">
      {/* Conditionally render the correct page */}
      {transactions ? (
        // If we have transactions, show the main chat interface
        <ChatPage initialTransactions={transactions} />
      ) : (
          <TestComponents/>
      )}
    </main>
  );
}

export default App;


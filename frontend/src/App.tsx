import { useState, useEffect } from "react"; // <-- Import useEffect
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { WelcomePage } from "./pages/WelcomePage";
import { ChatPage } from "./pages/ChatPage";
import { LoginPage } from "./pages/LoginPage";
import { uploadTransactions } from "./api/transactionAPI";
import { loginUser } from "./api/UsersApi";
import { Button } from "./components/ui/Button";

function App() {
  // --- Main Application Logic ---
  const MainApp = () => {
    const { user, isLoaded: userIsLoaded } = useUser();

    // State for the main app flow
    const [isDataReady, setIsDataReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // --- ADDED: State to track backend user sync ---
    const [isSynced, setIsSynced] = useState(false);

    // --- MOVED LOGIC: User sync logic now lives here ---
    useEffect(() => {
      // If the user object is loaded and we haven't synced yet...
      if (user && !isSynced) {
        const syncUserWithBackend = async () => {
          try {
            console.log("Syncing user with backend:", { clerkId: user.id });
            const existed = await loginUser({
              email: user.primaryEmailAddress!.emailAddress,
              clerkId: user.id,
            });
            console.log(existed)
            if(existed) {
              setIsDataReady(true)
            }
            console.log("Backend sync successful! ✅");
            setIsSynced(true); // Mark as synced to prevent re-running
          } catch (error) {
            console.error("Failed to sync user with backend:", error);
            // Optional: You could set the main error state here if syncing is critical
            // setError("Could not sync your profile. Please try again.");
          }
        };

        syncUserWithBackend();
      }
    }, [user, isSynced]); // Dependencies: run when user object changes

    const handleFileUpload = async (file: File) => {
      // ... (rest of the function is unchanged)
      if (!user) {
        setError("User is not authenticated.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await uploadTransactions(file, user.id);
        if (response.status === 'success' && response.imported_count > 0) {
            setIsDataReady(true);
        } else if (response.imported_count === 0) {
            setError("Upload succeeded, but no transactions were found in the file.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setIsDataReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    const handleReset = () => {
      setIsDataReady(false);
      setError(null);
    };

    if (!userIsLoaded) {
      return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
          <p>Loading profile...</p>
        </div>
      );
    }
    
    // ... (rest of the MainApp component is unchanged)

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center p-4">
          <h2 className="text-2xl font-bold text-destructive mb-4">Oops! Something went wrong.</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={handleReset} disabled={isLoading}>Try Again</Button>
        </div>
      );
    }

    return (
      <main>
        {isDataReady ? (
          <ChatPage />
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
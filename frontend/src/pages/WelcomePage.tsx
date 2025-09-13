import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Transaction } from "@/types";
import { mockTransactions } from "@/api/MockData";

interface WelcomePageProps {
  onUploadSuccess: (transactions: Transaction[]) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onUploadSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  // In the real app, this would handle the file upload API call.
  // For our frontend-first approach, we'll simulate a successful upload
  // with mock data after a short delay.
  const handleFileUpload = () => {
    setIsLoading(true);

    // Simulate an API call delay
    setTimeout(() => {
      console.log("Simulating upload success with mock data.");
      onUploadSuccess(mockTransactions);
      setIsLoading(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <img src="/bot-avatar.svg" alt="FinChat Bot" className="w-20 h-20 mx-auto mb-4" />
          <CardTitle className="text-2xl text-blue-900">Meet your personal finance buddy</CardTitle>
          <CardDescription className="text-blue-700">
            Let's get started by looking at your recent activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleFileUpload}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Analyzing..." : "Upload Transaction CSV"}
          </Button>
          <p className="text-xs text-center text-slate-500 mt-3">
            Your data is kept private and secure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

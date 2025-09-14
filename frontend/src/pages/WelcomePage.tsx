import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface WelcomePageProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onFileUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit">
            <img src="/bot-avatar.svg" alt="FinChat Bot" className="w-12 h-12" />
          </div>
          <CardTitle className="mt-4">Meet your personal finance buddy.</CardTitle>
          <CardDescription>
            I can help you track your spending and reach your goals. Let's start by looking at your recent activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
          />
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handleButtonClick}
            isLoading={isLoading} // Use the isLoading prop
          >
            Upload Transaction CSV
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Your data is kept private and never stored on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};


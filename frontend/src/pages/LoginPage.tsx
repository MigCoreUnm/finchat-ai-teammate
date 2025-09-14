import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function LoginPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <img
          src="/bot-avatar.svg"
          alt="FinChat Logo"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-blue-900">
          {isSigningUp ? "Create Your Account" : "Welcome Back"}
        </h1>
        <p className="text-blue-700/80 mt-2">
          Your personal AI finance buddy is ready to help.
        </p>
      </div>

      {/* This is the main container for the Clerk components.
        By removing the 'path' and 'routing' props, these components will
        always render when this page is visible, solving the core issue.
      */}
      <Card className="p-2 min-w-[350px]">
        {isSigningUp ? <SignUp /> : <SignIn />}
      </Card>

      {/* This section allows the user to toggle between the two forms */}
      <div className="text-center mt-6">
        <p className="text-sm text-slate-600">
          {isSigningUp
            ? "Already have an account?"
            : "Don't have an account yet?"}
        </p>
        <Button
          variant="link"
          className="font-semibold"
          onClick={() => setIsSigningUp((prev) => !prev)}
        >
          {isSigningUp ? "Sign In" : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressDonut } from "@/components/ui/ProgressDonut";
import { ArrowRight, Mail } from "lucide-react";

export function TestComponents() {
  return (
    <div className="bg-blue-50 min-h-screen p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-blue-900/90 tracking-tight">
          Component Showcase
        </h1>

        {/* Buttons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-800">Buttons</h2>
          
          <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
              <h3 className="font-medium text-blue-900">Standard Variants</h3>
              <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button disabled>Disabled</Button>
              </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
              <h3 className="font-medium text-blue-900">Shapes & States</h3>
              <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" shape="pill">Pill Shape</Button>
                  <Button variant="secondary" shape="pill">Pill Shape</Button>
                  <Button variant="primary" isLoading={true} />
                  <Button variant="secondary" isLoading={true} />
              </div>
          </div>
        </div>

        {/* Card */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-800">Card</h2>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>This is the card description.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                This is the main content area of the card where information is
                displayed.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="primary" className="w-full">
                  Card Action
                  <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-800">Input with Icon</h2>
          <div className="relative max-w-sm">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="name@example.com"
                className="pl-10"
              />
          </div>
        </div>

        {/* Progress Donut */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-800">
            Progress Donut
          </h2>
          <div className="flex flex-wrap items-center gap-8 p-6 bg-white rounded-xl shadow-sm">
              <div className="flex flex-col items-center">
                  <p className="text-center text-sm font-medium text-blue-800 mb-2">Starting Out</p>
                  <ProgressDonut progress={25} subtext="of $500" />
              </div>
              <div className="flex flex-col items-center">
                  <p className="text-center text-sm font-medium text-blue-800 mb-2">Making Progress</p>
                  <ProgressDonut progress={75} />
              </div>
              <div className="flex flex-col items-center">
                  <p className="text-center text-sm font-medium text-blue-800 mb-2">Goal Achieved</p>
                  <ProgressDonut progress={100} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

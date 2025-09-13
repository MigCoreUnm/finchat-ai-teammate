import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type{ SavingTip } from "@/types";

interface SavingTipCardProps {
  tip: SavingTip;
}

export const SavingTipCard: React.FC<SavingTipCardProps> = ({ tip }) => {
  return (
    <Card className="bg-white border-blue-200 overflow-hidden w-full max-w-md">
      <CardHeader className="bg-blue-500 text-white p-3">
        <div className="flex items-center gap-2">
          <LightbulbIcon className="w-5 h-5" />
          <CardTitle className="text-base font-semibold text-white">{tip.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-blue-800 mb-4">{tip.description}</p>
        <div className="flex items-center gap-2">
            <Button variant="secondary" className="flex-1">Show on Map</Button>
            <Button variant="ghost" className="flex-1">Thanks for the tip!</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// SVG Icon for the tip card
const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 2 7h10c0-2 2-4 2-7a7 7 0 0 0-7-7Z" />
    </svg>
);

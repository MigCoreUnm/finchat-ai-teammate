import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressDonut } from "@/components/ui/ProgressDonut";
import type { UserGoal, SpendingSummaryResponse, TransactionCategory } from "@/types";

interface SidebarProps {
  goal: UserGoal;
  summary: SpendingSummaryResponse;
}

// A small component for the legend items in the spending chart
const LegendItem = ({ color, name, value }: { color: string, name: string, value: string }) => (
    <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            <p className="text-blue-700">{name}</p>
        </div>
        <p className="font-medium text-blue-900">{value}</p>
    </div>
);


export const Sidebar: React.FC<SidebarProps> = ({ goal, summary }) => {
  const progressPercentage = (goal.current_progress / goal.target_amount) * 100;

  // Get top 3 spending categories to display
  const topCategories = Object.entries(summary.spending_by_category)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <aside className="space-y-6">
      {/* Goal Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Your Goal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ProgressDonut progress={progressPercentage} />
          <p className="text-center text-blue-700 mt-4">
            You're on your way to saving for your <span className="font-bold text-blue-900">{goal.goal_name}</span>!
          </p>
        </CardContent>
      </Card>

      {/* Weekly Snapshot */}
      <Card>
          <CardHeader>
              <CardTitle className="text-blue-900">Spending Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              <LegendItem color="bg-blue-500" name={topCategories[0]?.[0] || 'N/A'} value={`$${topCategories[0]?.[1].toFixed(2)}`} />
              <LegendItem color="bg-blue-300" name={topCategories[1]?.[0] || 'N/A'} value={`$${topCategories[1]?.[1].toFixed(2)}`} />
              <LegendItem color="bg-blue-100" name={topCategories[2]?.[0] || 'N/A'} value={`$${topCategories[2]?.[1].toFixed(2)}`} />
          </CardContent>
      </Card>

      {/* Quick Insight */}
       <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
              <CardTitle className="text-blue-900">Quick Insight</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-blue-800 text-sm">{summary.insight_message}</p>
          </CardContent>
      </Card>
    </aside>
  );
};

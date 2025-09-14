import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { 
    BarChart, Bar, 
    LineChart, Line, 
    PieChart, Pie, Cell, 
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

// --- Data Structures ---
export interface DashboardData {
  totalSpending: number;
  totalIncome: number;
  netFlow: number;
  spendingByCategory: { name: string; amount: number }[];
  spendingOverTime: { name: string; spending: number }[];
  topMerchants: { name: string; value: number }[];
}

// --- Embedded Mock Data ---
const mockDashboardData: DashboardData = {
  totalSpending: 2543.50,
  totalIncome: 4200.00,
  netFlow: 1656.50,
  spendingByCategory: [
    { name: 'Housing', amount: 1500.00 },
    { name: 'Food & Drink', amount: 450.25 },
    { name: 'Transport', amount: 250.75 },
    { name: 'Shopping', amount: 180.50 },
    { name: 'Entertainment', amount: 162.00 },
  ],
  spendingOverTime: [
    { name: 'Mon', spending: 50.75 }, { name: 'Tue', spending: 85.20 },
    { name: 'Wed', spending: 30.50 }, { name: 'Thu', spending: 120.00 },
    { name: 'Fri', spending: 95.80 }, { name: 'Sat', spending: 210.40 },
    { name: 'Sun', spending: 60.10 },
  ],
  topMerchants: [
    { name: 'Amazon', value: 540.50 },
    { name: 'Whole Foods', value: 312.80 },
    { name: 'Lyft', value: 180.20 },
  ],
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background/80 backdrop-blur-sm p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
            <span className="font-bold text-foreground">${payload[0].value.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
const COLORS = ['#5970FB', '#7896FF', '#9FBCFF', '#C3D7FF'];

// The component no longer needs to accept a 'data' prop
export const Dashboard: React.FC = () => {
  const data = mockDashboardData; // Use the embedded mock data

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        {/* --- Top Row: KPIs --- */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.totalSpending.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">in the current period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.totalIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">in the current period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${data.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.netFlow < 0 && '-'}${Math.abs(data.netFlow).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Income vs. Expenses</p>
              </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* --- Row 2: Main Visualizations --- */}
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>A breakdown of your expenses this period.</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.spendingByCategory}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Spending Trend</CardTitle>
                    <CardDescription>Your spending activity over the last week.</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.spendingOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="spending" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        {/* --- Row 3: Granular Insights --- */}
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
                 <CardHeader>
                    <CardTitle>Top Merchants</CardTitle>
                    <CardDescription>Where you spent the most money.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6 h-[200px]">
                    <ResponsiveContainer width="40%" height="100%">
                        <PieChart>
                            <Pie data={data.topMerchants} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                                {data.topMerchants.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                        {data.topMerchants.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span style={{ backgroundColor: COLORS[index % COLORS.length] }} className="h-3 w-3 rounded-full" />
                                    <span>{entry.name}</span>
                                </div>
                                <span className="font-semibold">${entry.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>More insights will be available here.</CardDescription>
                </CardHeader>
                 <CardContent className="flex items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">...</p>
                 </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};


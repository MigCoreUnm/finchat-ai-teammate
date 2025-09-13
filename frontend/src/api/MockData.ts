import type {
  Transaction,
  SpendingSummaryResponse,
  SavingTip,
  TransactionCategory,
  UserGoal
} from "@/types"
// A realistic set of transactions to populate the UI.
// Includes the specific coffee transaction needed to trigger the demo tip.
export const mockTransactions: Transaction[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    date: "2025-09-12",
    description: "Daily Grind Coffee",
    amount: -6.5,
    category: "Food & Drink",
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
    date: "2025-09-12",
    description: "Lyft Ride",
    amount: -15.75,
    category: "Transport",
  },
  {
    id: "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
    date: "2025-09-11",
    description: "Trader Joe's Groceries",
    amount: -85.3,
    category: "Shopping",
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-890abcdef123",
    date: "2025-09-10",
    description: "Rent Payment",
    amount: -2500.0,
    category: "Housing",
  },
  {
    id: "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
    date: "2025-09-09",
    description: "Movie Ticket",
    amount: -18.0,
    category: "Entertainment",
  },
  {
    id: "f6a7b8c9-d0e1-2345-6789-0abcdef12345",
    date: "2025-09-08",
    description: "Salary Deposit",
    amount: 3500.0,
    category: "Income",
  },
];

// A mock summary object that looks like it came from the AI backend.
export const mockSummary: SpendingSummaryResponse = {
  total_spending: 2625.55,
  spending_by_category: {
    "Food & Drink": 6.5,
    Transport: 15.75,
    Shopping: 85.3,
    Housing: 2500.0,
    Entertainment: 18.0,
    Income: 0, // Not typically included in spending
    Other: 0,
  },
  insight_message:
    "Your spending was 15% lower than last week! Great job. You spent the most on 'Housing'.",
};

// The mock data for the "killer feature" demo card.
export const mockTip: SavingTip = {
  title: "Money-Saving Tip!",
  description:
    "I noticed you spent $6.50 at 'Daily Grind Coffee'. 'The Coffee Bean' is nearby and could save you ~$1.50.",
  potential_savings: 1.5,
  location_info: {
    current_merchant: "Daily Grind Coffee",
    suggested_merchant: "The Coffee Bean",
    // Coordinates near the Ferry Building in SF
    latitude: 37.7955,
    longitude: -122.3937,
  },
};




// --- ADD THIS EXPORT ---
// This was the missing piece causing the error.
export const mockGoal: UserGoal = {
  goal_name: "Vacation Fund",
  target_amount: 500,
  current_progress: 350,
};
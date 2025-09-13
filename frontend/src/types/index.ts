// A string literal type for categories to match the backend Enum.
// Using a type instead of a generic string prevents typos and ensures consistency.
export type TransactionCategory =
  | "Food & Drink"
  | "Transport"
  | "Shopping"
  | "Housing"
  | "Entertainment"
  | "Income"
  | "Other";

// The core Transaction type. This is the fundamental unit of data.
export interface Transaction {
  id: string; // UUIDs are represented as strings in JSON
  date: string; // Dates are also strings in JSON (e.g., "2025-09-13")
  description: string;
  amount: number;
  category?: TransactionCategory; // The category is optional, to be filled by the AI
}

// Type for the user's financial goal
export interface UserGoal {
  goal_name: string;
  target_amount: number;
  current_progress: number;
}

// --- API Response Types ---
// These types define the expected structure of data coming from your FastAPI backend.

// Response after a user uploads their CSV file
export interface TransactionUploadResponse {
  message: string;
  transaction_count: number;
  transactions: Transaction[];
}

// Response for a spending summary request
export interface SpendingSummaryResponse {
  total_spending: number;
  // `Record<Key, Value>` is TypeScript's way of defining a dictionary or hash map.
  spending_by_category: Record<TransactionCategory, number>;
  insight_message: string;
}

// Type for location data used in the saving tip feature
export interface LocationInfo {
  current_merchant: string;
  suggested_merchant: string;
  latitude: number;
  longitude: number;
}

// The proactive saving tip that will be displayed in a special card
export interface SavingTip {
  title: string;
  description: string;
  potential_savings: number;
  location_info?: LocationInfo;
}

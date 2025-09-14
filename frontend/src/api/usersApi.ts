// frontend/src/api/userAPI.ts

import type { FinancialContext , Policy, Transaction} from '../types';

// Use environment variable for the base URL, falling back to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/**
 * Fetches the complete financial context (Transactions, Goals, Policies) for a user.
 * @param clerkId The authenticated user's Clerk ID.
 */
export const fetchFinancialContext = async (clerkId: string): Promise<FinancialContext> => {
  if (!clerkId) {
    throw new Error("User ID is required to fetch context.");
  }

  // Construct the URL with the required query parameter
  // We use the URL object for robust parameter encoding
  const url = new URL(`${API_BASE_URL}/user/context`);
  url.searchParams.append('clerk_id', clerkId);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Attempt to parse detailed error messages from the backend (FastAPI format)
      const errorData = await response.json().catch(() => ({ detail: "Unknown server error" }));
      throw new Error(errorData.detail || `Failed to fetch context: ${response.status}`);
    }

    const data: FinancialContext = await response.json();
    return data;

  } catch (error) {
    console.error("API Error fetching financial context:", error);
    throw error; // Re-throw so the component can handle the UI state
  }
};

export const loginUser = async (userData: { email: string; clerkId: string }): Promise<boolean> => {
  if (!userData.clerkId || !userData.email) {
    throw new Error("Clerk ID and email are required for login.");
  }

  const url = `${API_BASE_URL}/login/login`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },

      body: JSON.stringify({
        email: userData.email,
        clerk_id: userData.clerkId, // Ensure key matches the backend schema
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Unknown server error" }));
      throw new Error(errorData.detail || `Login failed: ${response.status}`);
    }

    const user = await response.json();
    return user;

  } catch (error) {
    console.error("API Error during user login:", error);
    throw error; // Re-throw for the calling component to handle
  }
};

export const addTransaction = async (clerkId: string, transactionData: Transaction): Promise<FinancialContext> => {
    const response = await fetch(`${API_BASE_URL}/user/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Clerk-Id': clerkId },
        body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
        throw new Error('Failed to add transaction.');
    }
    return response.json();
};




export const addPolicy = async (
  clerkId: string, 
  policyData: Omit<Policy, 'policy_id' | 'current_spending' | 'timeframe'> 

): Promise<FinancialContext> => {
  console.log(policyData)
    const response = await fetch(`${API_BASE_URL}/user/policies`, { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Clerk-Id': clerkId // Pass Clerk ID in the header
        },
        body: JSON.stringify(policyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add policy.');
    }
    return response.json();
};

import type { TransactionUploadResponse, UserGoal } from "@/types";

// The base URL of your running FastAPI server
const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Uploads a transaction CSV file to the backend.
 * @param file The CSV file selected by the user.
 * @returns A promise that resolves to the transaction data.
 */
export const uploadTransactions = async (file: File): Promise<TransactionUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/transactions/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file. Please try again.");
  }

  return response.json();
};

/**
 * Sends the user's financial goal to the backend.
 * @param goal The user's goal object.
 * @returns A promise that resolves to the server's confirmation message.
 */
export const setUserGoal = async (goal: Omit<UserGoal, 'current_progress'>) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/goal/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(goal),
    });

    if (!response.ok) {
        throw new Error("Failed to set goal. Please try again.");
    }

    return response.json();
}

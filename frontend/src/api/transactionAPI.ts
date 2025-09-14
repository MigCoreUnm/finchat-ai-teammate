// src/api/transactionAPI.ts

// Use environment variables for flexibility, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Define the expected response structure from the backend
interface UploadResponse {
  status: string;
  imported_count: number;
}

export const uploadTransactions = async (file: File, clerkId: string): Promise<UploadResponse> => {
  if (!file || !clerkId) {
    throw new Error("File and User ID are required.");
  }

  const formData = new FormData();
  formData.append('file', file);
  // This key 'clerk_id' MUST match the Form(...) parameter name in the FastAPI backend
  formData.append('clerk_id', clerkId);

  const response = await fetch(`${API_BASE_URL}/user/upload`, {
    method: 'POST',
    body: formData,
    // CRITICAL: Do NOT set Content-Type header manually; the browser handles it for FormData.
  });

  if (!response.ok) {
    // Attempt to parse FastAPI error details
    const errorData = await response.json().catch(() => ({ detail: "Unknown server error" }));
    throw new Error(errorData.detail || `Upload failed with status: ${response.status}`);
  }

  const data: UploadResponse = await response.json();
  return data;
};


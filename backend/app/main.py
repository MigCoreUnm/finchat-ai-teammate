from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router  # We will use the central router

app = FastAPI(
    title="FinChat AI Teammate API",
    description="API for the AI-powered financial buddy.",
    version="1.0.0",
)

# --- CORS Middleware ---
origins = [
    "http://localhost:5173",  # The default Vite dev server port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A simple root endpoint to confirm the server is running
@app.get("/")
def read_root():
    return {"message": "Welcome to the FinChat API!"}

# --- Include the API Router ---
# This single line correctly registers all your endpoints
# (like /transactions/upload and /goal) under the /api/v1 prefix.
app.include_router(api_router, prefix="/api/v1")


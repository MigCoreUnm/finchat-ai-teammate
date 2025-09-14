from datetime import date
from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4

# Using an Enum provides consistency and prevents typos for categories
class TransactionCategory(str, Enum):
    FOOD_DRINK = "Food & Drink"
    TRANSPORT = "Transport"
    SHOPPING = "Shopping"
    HOUSING = "Housing"
    ENTERTAINMENT = "Entertainment"
    INCOME = "Income"
    OTHER = "Other"

# The core Transaction model
class Transaction(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    date: date
    description: str
    amount: float
    category: Optional[TransactionCategory] = None

    # This allows the model to be created from ORM objects if you use a DB later
    class Config:
        from_attributes = True

# --- API Request/Response Models ---

# Model for setting a user's goal
class UserGoal(BaseModel):
    goal_name: str
    target_amount: float
    current_progress: float = 0.0

# Response after a successful CSV upload
class TransactionUploadResponse(BaseModel):
    message: str
    transaction_count: int
    transactions: List[Transaction]
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# --- API Schemas ---
# These models define the shape of the data for API requests and responses.
# They are what the frontend will interact with. They do NOT include database-specific
# fields like '_id'.

class Goal(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0

class Transaction(BaseModel):
    date: date
    description: str
    amount: float
    category: Optional[str] = None

class BankAccount(BaseModel):
    account_name: str
    transactions: List[Transaction] = []

class UserDocument(BaseModel):
    """
    The main user data object that the API will return to the frontend.
    """
    email: str
    clerk_id: str
    goals: List[Goal] = []
    accounts: List[BankAccount] = []
    # recommendations can be added later

class UserLoginRequest(BaseModel):
    """
    The data the frontend will send when a user logs in.
    """
    email: str
    clerk_id: str

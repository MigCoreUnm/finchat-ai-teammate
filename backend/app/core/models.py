import uuid
from datetime import datetime, date
from enum import Enum
from typing import Any, List, Optional

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, GetCoreSchemaHandler
from pydantic_core import core_schema

# =============================================================================
# 1. HELPER CLASSES & ENUMS
# =============================================================================

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        def validate(value: Any) -> ObjectId:
            if not ObjectId.is_valid(value):
                raise ValueError("Invalid ObjectId")
            return ObjectId(value)

        from_input_schema = core_schema.chain_schema([
            core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.str_schema(),
            ]),
            core_schema.no_info_plain_validator_function(validate),
        ])

        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=from_input_schema,
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda instance: str(instance)
            ),
        )

class AddTransactionRequest(BaseModel):
    description: str
    amount: float
    date: date
    category: str
    
class TransactionCategory(str, Enum):
    FOOD_DRINK = "Food & Drink"
    TRANSPORT = "Transport"
    SHOPPING = "Shopping"
    HOUSING = "Housing"
    ENTERTAINMENT = "Entertainment"
    INCOME = "Income"
    GROCERIES = "Groceries"
    UTILITIES = "Utilities"
    TRANSFERS = "Transfers"
    REFUND = "Refund"
    BILLS = "Bills"
    HEALTH = "Health"
    GAS = "Gas"
    HOME_IMPROVEMENT = "Home Improvement"
    ELECTRONICS = "Electronics"
    OTHER = "Other"

# =============================================================================
# 2. DATABASE MODELS (Schema for MongoDB Documents)
# =============================================================================

class GoalDB(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0

class PolicyDB(BaseModel):
    policy_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    description: str  # e.g., "Limit Coffee Spending"
    limit_amount: float
    timeframe: str = "monthly" 
    target_category: str
    current_spending: float = 0.0

class TransactionDB(BaseModel):
    transaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime  # <--- Changed from date
    description: str
    amount: float
    category: Optional[TransactionCategory] = None
    merchant: Optional[str] = None

class BankAccountDB(BaseModel):
    account_name: str

class UserDocumentDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: str
    clerk_id: str
    goals: List[GoalDB] = Field(default_factory=list)
    policies: List[PolicyDB] = Field(default_factory=list)
    accounts: List[BankAccountDB] = Field(default_factory=list)
    transactions: List[TransactionDB] = Field(default_factory=list)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )


# =============================================================================
# 3. API MODELS (Data Transfer Objects for HTTP Requests/Responses)
# =============================================================================

# --- API Request Models ---

class UserLoginRequest(BaseModel):
    email: str
    clerk_id: str

class UserGoalRequest(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0

class TransactionCreate(BaseModel):
    """Payload for creating a single new transaction."""
    date: datetime  # <--- Changed from date
    description: str
    amount: float
    category: Optional[TransactionCategory] = None


# --- API Response Models ---

class GoalAPI(BaseModel):
    """Represents a goal in an API response."""
    name: str
    target_amount: float
    current_amount: float

class TransactionAPI(BaseModel):
    """Represents a transaction in an API response."""
    date: datetime  # <--- Changed from date
    description: str
    amount: float
    category: Optional[TransactionCategory] = None

class BankAccountAPI(BaseModel):
    """Represents a bank account in an API response."""
    account_name: str
    transactions: List[TransactionAPI] = []

class UserDocument(BaseModel):
    """The main user data object that the API will return to the frontend."""
    email: str
    clerk_id: str
    goals: List[GoalAPI] = []
    accounts: List[BankAccountAPI] = []

class UserResponse(BaseModel):
    exists: bool

class TransactionUploadResponse(BaseModel):
    status: str
    imported_count: int
    total_in_file: int

# =============================================================================
# 4. INTERNAL LOGIC MODELS (For specific application logic like RAG)
# =============================================================================
class AddPolicyRequest(BaseModel):
    """ 
    The data sent from the frontend to create a new policy.
    This is the schema you requested.
    """
    description: str
    limit_amount: float
    target_category: str
    
class FinancialContext(BaseModel):
    goals: List[GoalDB] = Field(default_factory=list)
    policies: List[PolicyDB] = Field(default_factory=list)
    transactions: List[TransactionDB] = Field(default_factory=list)
    
class CategorizedTransaction(BaseModel):
    """A transaction that has been categorized into a specific type."""
    category: TransactionCategory = Field(description="The category of the transaction")

class UserGoal(BaseModel):
    title:str
    description:str
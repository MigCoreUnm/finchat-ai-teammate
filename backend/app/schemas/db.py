from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from bson import ObjectId

# This is a helper class to handle MongoDB's ObjectId.
# Pydantic doesn't know how to handle it by default.
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# --- Database Models ---
# These models represent the data exactly as it is stored in MongoDB.
# They include the '_id' field and use the PyObjectId helper.

class GoalDB(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0

class TransactionDB(BaseModel):
    date: date
    description: str
    amount: float
    category: Optional[str] = None

class BankAccountDB(BaseModel):
    account_name: str
    transactions: List[TransactionDB] = []

class UserDocumentDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: str
    clerk_id: str
    goals: List[GoalDB] = []
    accounts: List[BankAccountDB] = []
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
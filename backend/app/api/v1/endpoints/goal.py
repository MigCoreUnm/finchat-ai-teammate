from fastapi import APIRouter
from app.core.models import PolicyDB
import logging
from fastapi import HTTPException
from pymongo.results import UpdateResult
from app.core.database import get_db
from app.core.models import UserDocumentDB, BankAccountDB, TransactionDB, FinancialContext, PolicyDB, UserDocument, UserLoginRequest, AddTransactionRequest, AddPolicyRequest
from typing import List, Tuple

router = APIRouter()

@router.post("/policies")
async def add_policy_to_user(clerk_id: str, policy_data: AddPolicyRequest) -> bool:
    """ Adds a new spending policy to the user's document. """
    db = await get_db()
    users_collection = db.get_collection("users")
    policy_db_model = PolicyDB(**policy_data.dict())
    policy_dict = policy_db_model.dict(by_alias=True)
    result: UpdateResult = await users_collection.update_one(
        {"clerk_id": clerk_id},
        {"$push": {"policies": policy_dict}}
    )
    return result.modified_count > 0

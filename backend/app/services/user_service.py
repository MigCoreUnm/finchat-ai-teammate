import logging
from fastapi import HTTPException
from pymongo.results import UpdateResult
from app.core.database import get_db
from app.core.models import UserDocumentDB, BankAccountDB, TransactionDB, FinancialContext, UserDocument, UserLoginRequest, AddTransactionRequest, AddPolicyRequest, PolicyDB
from typing import List, Tuple

logger = logging.getLogger(__name__)

async def get_or_create_user(login_data: UserLoginRequest) -> Tuple[bool, UserDocument]:
    """
    Fetches a user, or creates one with a default account if they don't exist.
    Returns a tuple: (user_existed: bool, user_document: UserDocument).
    """
    db = await get_db()
    users_collection = db.get_collection("users")
    
    user_db_data = await users_collection.find_one({"clerk_id": login_data.clerk_id})
    
    if user_db_data:
        logger.info(f"User found for clerk_id: {login_data.clerk_id}")
        try:
            user_db_model = UserDocumentDB(**user_db_data)
            return True, UserDocument.model_validate(user_db_model.model_dump())
        except Exception as e:
            logger.error(f"Data validation error for existing user {login_data.clerk_id}: {e}")
            raise HTTPException(status_code=500, detail="User data is corrupted.")

    logger.info(f"Creating new user for clerk_id: {login_data.clerk_id}")
    
    default_account = BankAccountDB(account_name="Primary Account", transactions=[])
    new_user_db_model = UserDocumentDB(
        email=login_data.email,
        clerk_id=login_data.clerk_id,
        accounts=[default_account]
    )
    
    new_user_dict = new_user_db_model.model_dump(by_alias=True, exclude={"id"})
    await users_collection.insert_one(new_user_dict)
    
    return False, UserDocument.model_validate(new_user_db_model.model_dump())

async def add_single_transaction(clerk_id: str, transaction_data: AddTransactionRequest) -> bool:
    """ Adds a single transaction to the user's top-level transactions array in MongoDB. """
    logger.info(f"Attempting to add single transaction for user: {clerk_id}")
    try:
        db = await get_db()
        users_collection = db.get_collection("users")
        transaction_db_model = TransactionDB(**transaction_data.dict())
        transaction_dict = transaction_db_model.dict(by_alias=True)
        
        # --- THIS IS THE FIX ---
        # The update path now correctly targets the top-level 'transactions' array.
        result: UpdateResult = await users_collection.update_one(
            {"clerk_id": clerk_id},
            {"$push": {"transactions": transaction_dict}}
        )
        
        if result.matched_count == 0 or result.modified_count == 0:
            logger.error(f"Failed to add transaction for user {clerk_id}. User not found or no document modified.")
            return False
        return True
    except Exception as e:
        logger.error(f"Error adding transaction for {clerk_id}: {e}")
        return False
    
async def get_user_financial_context(clerk_id: str) -> FinancialContext | None:
    """ Retrieves the complete financial context for a user. """
    db = await get_db()
    users_collection = db.get_collection("users")
    user_data = await users_collection.find_one({"clerk_id": clerk_id})
    if not user_data:
        return None
    
    # We validate against the DB model first
    user_db_model = UserDocumentDB(**user_data)
    # Then we convert to the FinancialContext API model
    return FinancialContext.model_validate(user_db_model.model_dump())

async def add_policy_to_user(clerk_id: str, policy_data: AddPolicyRequest) -> bool:
    """
    Adds a new spending policy to the user's 'policies' list in MongoDB.
    """
    logger.info(f"Attempting to add policy for user: {clerk_id}")
    try:
        db = await get_db()
        users_collection = db.get_collection("users")

        # Convert the incoming request data to the full PolicyDB model.
        # This automatically adds default values like policy_id, timeframe, etc.
        policy_db_model = PolicyDB(**policy_data.dict())
        policy_dict = policy_db_model.dict(by_alias=True)

        # Find the user by clerk_id and push the new policy into their 'policies' array.
        result: UpdateResult = await users_collection.update_one(
            {"clerk_id": clerk_id},
            {"$push": {"policies": policy_dict}}
        )

        # Check if a document was found and modified.
        if result.modified_count == 0:
            logger.warning(f"Could not add policy for {clerk_id}. User not found or no changes made.")
            return False

        logger.info(f"Successfully added policy for user: {clerk_id}")
        return True

    except Exception as e:
        logger.error(f"An unexpected error occurred while adding policy for {clerk_id}: {e}")
        return False
from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException, Query, Header
from app.services import csv_parser, user_service
from app.core.database import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging
from app.core.models import FinancialContext, PolicyDB, AddPolicyRequest, TransactionDB, UserResponse, AddTransactionRequest, UserDocumentDB, BankAccountDB, UserDocument, UserLoginRequest

router = APIRouter()
# Initialize logger if not already done
logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# Route 1: Upload Transactions (POST) - Ingestion
# (Assuming this is the implementation established previously)
# -----------------------------------------------------------------------------


@router.post("/upload", status_code=201)
async def upload_user_transactions(
    file: UploadFile = File(...),
    clerk_id: str = Form(...),
):
    """
    Accepts a CSV file, parses it, and saves the transactions to the user's document.
    """
    if not file.filename.endswith('.csv') and file.content_type != 'text/csv':
         raise HTTPException(status_code=400, detail="File must be a CSV.")

    # 1. Parse
    try:
        # Assuming csv_parser.parse_csv is the async function defined earlier
        transactions = await csv_parser.parse_csv(file)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during CSV parsing: {e}")
        raise HTTPException(status_code=400, detail="Error processing CSV file.")


    if not transactions:
        raise HTTPException(status_code=400, detail="No valid transactions found.")

    # 2. Persist
    success = await user_service.add_transactions_to_user(clerk_id, transactions)

    if not success:
         raise HTTPException(status_code=500, detail="Failed to update transactions or user not found.")

    return {
        "status": "success",
        "imported_count": len(transactions)
    }


@router.post("/policies", response_model=FinancialContext) # <-- Changed in Step 2
async def add_policy_to_user(
    policy_data: AddPolicyRequest,
    clerk_id: str = Header(...)  # <--- Tell FastAPI to get clerk_id from the header
) -> FinancialContext: # <-- Changed in Step 2
    """ Adds a new spending policy to the user's document. """
    success = await user_service.add_policy_to_user(clerk_id, policy_data)
    if not success:
        raise HTTPException(status_code=404, detail="User not found or failed to add policy.")

    # Fetch and return the updated context
    updated_context = await user_service.get_user_financial_context(clerk_id)
    if not updated_context:
         raise HTTPException(status_code=500, detail="Policy added, but failed to retrieve updated context.")

    return updated_context

@router.get("/context", response_model=FinancialContext, status_code=200)
async def retrieve_financial_context(
    clerk_id: str = Query(..., description="The Clerk User ID"),
):
    """
    Retrieves the complete financial context (Goals, Policies, Transactions) for the user.
    """
    logger.info(f"Received request for financial context retrieval for {clerk_id}")

    try:
        context = await user_service.get_user_financial_context( clerk_id)
        
        # The service handles user-not-found by returning an empty context (200 OK).
        return context

    except Exception as e:
        # Catch unexpected server errors
        logger.error(f"Error retrieving financial context for {clerk_id}: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while retrieving financial context.")
    
    
@router.post("/transactions", response_model=FinancialContext)
async def add_single_transaction(
    transaction_data: AddTransactionRequest,
    clerk_id: str = Header(...),
):
    """ Adds a single transaction and returns the updated user context. """
    success = await user_service.add_single_transaction(clerk_id, transaction_data)
    if not success:
        raise HTTPException(status_code=404, detail="User not found or failed to add transaction.")
        
    updated_context = await user_service.get_user_financial_context(clerk_id)
    if not updated_context:
        raise HTTPException(status_code=500, detail="Transaction added, but failed to retrieve updated context.")
        
    return updated_context

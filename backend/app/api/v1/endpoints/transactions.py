from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.transaction import TransactionUploadResponse
from app.services.csv_parser import parse_csv_to_transactions

router = APIRouter()

@router.post("/upload", response_model=TransactionUploadResponse)
async def upload_transactions(file: UploadFile = File(...)):
    """
    Accepts a CSV file of transactions, parses it, and returns the data.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")

    try:
        # Read the file contents as bytes
        contents = await file.read()
        # Pass the contents to our parsing service
        parsed_transactions = parse_csv_to_transactions(contents)
        
        return {
            "message": "File processed successfully",
            "transaction_count": len(parsed_transactions),
            "transactions": parsed_transactions,
        }
    except ValueError as e:
        # If the parser raises an error, return a 400 Bad Request response
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
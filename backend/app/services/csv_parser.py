import pandas as pd
from fastapi import UploadFile
from typing import List
from io import StringIO

from app.schemas.transaction import Transaction

def parse_csv_to_transactions(contents: bytes) -> List[Transaction]:
    """
    Parses the byte contents of a CSV file into a list of Transaction models.

    Args:
        contents: The byte string content of the uploaded file.

    Returns:
        A list of Transaction Pydantic models.

    Raises:
        ValueError: If the CSV is missing required columns.
    """
    # Convert bytes to a string-like object for Pandas
    csv_data = StringIO(contents.decode("utf-8"))
    
    try:
        df = pd.read_csv(csv_data)

        # --- Data Validation ---
        required_columns = ["Date", "Description", "Amount"]
        if not all(col in df.columns for col in required_columns):
            raise ValueError(f"CSV is missing one of the required columns: {required_columns}")

        transactions = []
        for index, row in df.iterrows():
            # Create a Transaction instance from each row
            transaction_data = Transaction(
                date=row["Date"],
                description=row["Description"],
                amount=row["Amount"],
            )
            transactions.append(transaction_data)
        
        return transactions

    except Exception as e:
        # Re-raise exceptions with a clear message to be caught by the endpoint
        raise ValueError(f"Error processing CSV file: {e}")
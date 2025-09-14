import pandas as pd
import io
import numpy as np
from fastapi import UploadFile, HTTPException
from typing import List
import os
from dotenv import load_dotenv
from app.core.models import TransactionCreate, CategorizedTransaction, TransactionCategory

# LangChain Imports
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

async def parse_csv(file: UploadFile) -> List[TransactionCreate]:
    # --- Initial file reading and data cleaning (same as before) ---
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV format.")

    df.columns = df.columns.str.strip().str.lower()

    required_columns = ['date', 'description', 'amount']
    if not all(col in df.columns for col in required_columns):
        raise HTTPException(status_code=400, detail="Missing required columns: date, description, amount.")

    try:
        df['date'] = pd.to_datetime(df['date']).dt.date
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
        if 'category' not in df.columns:
            df['category'] = np.nan
        df['category'] = df['category'].replace({np.nan: None})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV data types: {e}")

    # --- LangChain Setup (same as before) ---
    model = ChatOpenAI(model="gpt-5-nano", temperature=0, api_key = os.getenv("LLM"))
    structured_llm = model.with_structured_output(CategorizedTransaction)
    prompt = ChatPromptTemplate.from_template(
        "Categorize the following financial transaction based on its description: '{description}'"
    )
    categorization_chain = prompt | structured_llm

    records = df.to_dict(orient='records')
    
    # --- BATCH PROCESSING LOGIC ---
    
    # 1. Separate records into those that need categorization and those that don't.
    records_to_categorize = []
    finalized_records = []
    for record in records:
        if pd.isna(record.get('category')):
            records_to_categorize.append(record)
        else:
            finalized_records.append(record)

    # 2. If there are records that need categorization, process them in a batch.
    if records_to_categorize:
        # Create a list of inputs for the batch call.
        batch_inputs = [{"description": r['description']} for r in records_to_categorize]
        
        # Make a single, efficient batch call to the API.
        batch_results = await categorization_chain.abatch(batch_inputs)
        
        # 3. Merge the results back into the original records.
        for record, result in zip(records_to_categorize, batch_results):
            record['category'] = result.category
        
        # Add the newly categorized records to our final list.
        finalized_records.extend(records_to_categorize)

    # --- Final Validation and Conversion ---
    parsed_transactions: List[TransactionCreate] = []
    for record in finalized_records:
        try:
            filtered_record = {k: v for k, v in record.items() if k in TransactionCreate.__fields__}
            transaction = TransactionCreate(**filtered_record)
            parsed_transactions.append(transaction)
        except Exception:
            continue

    return parsed_transactions
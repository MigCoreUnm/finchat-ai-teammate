import os
import logging
import numpy as np
from openai import OpenAI
from app.services import user_service
from app.core.models import FinancialContext, Transaction
from typing import List

# --- Dependency Imports ---
# Make sure you have run: pip install faiss-cpu scikit-learn openai
import faiss 
from sklearn.preprocessing import normalize

logger = logging.getLogger(__name__)
client = OpenAI()

# --- Core Vectorization and RAG Logic ---

def create_vector_index(transactions: List[Transaction]):
    """
    Creates a FAISS index from a list of transaction descriptions.
    This is the "vectorizing the database" step.
    """
    if not transactions:
        return None, None

    descriptions = [t.description for t in transactions]
    
    # 1. Create Embeddings using OpenAI's powerful and efficient model
    response = client.embeddings.create(
        input=descriptions,
        model="text-embedding-3-small" # State-of-the-art embedding model
    )
    embeddings = np.array([item.embedding for item in response.data])
    
    # 2. Normalize embeddings for accurate similarity search
    faiss.normalize_L2(embeddings)
    
    # 3. Build the FAISS index
    index = faiss.IndexFlatIP(embeddings.shape[1]) # Using Inner Product for similarity
    index.add(embeddings)
    
    return index, descriptions

async def generate_chat_response(clerk_id: str, user_message: str) -> str:
    """
    This is the new, vectorized RAG function.
    """
    logger.info(f"Generating vectorized AI response for user {clerk_id}")

    # 1. RETRIEVE (unchanged): Get the user's real-time financial data.
    context = await user_service.get_user_financial_context(clerk_id)
    if not context or not context.transactions:
        return "I can't seem to find any transaction data to analyze. Please upload a CSV first."

    # 2. VECTORIZE & INDEX: Create the in-memory vector database.
    vector_index, transaction_descriptions = create_vector_index(context.transactions)
    if not vector_index:
        return "I had trouble analyzing your transactions. Please try again."

    # 3. SEMANTIC SEARCH: Find transactions relevant to the user's query.
    # Convert the user's question into a vector
    query_response = client.embeddings.create(input=[user_message], model="text-embedding-3-small")
    query_vector = np.array([query_response.data[0].embedding])
    faiss.normalize_L2(query_vector)

    # Search the index for the top 3 most similar transactions
    k = 3
    distances, indices = vector_index.search(query_vector, k)
    
    # Retrieve the descriptions of the most relevant transactions
    relevant_transactions = [transaction_descriptions[i] for i in indices[0]]
    
    # 4. AUGMENT & GENERATE: Build the context-rich prompt.
    system_prompt = f"""
    You are FinChat, an expert AI financial co-pilot.
    Your goal is to provide data-driven, insightful advice based on the user's actual spending.
    
    When answering the user's question, you MUST base your answer on the following highly relevant transactions that were found in their financial history:
    - Transaction 1: "{relevant_transactions[0]}"
    - Transaction 2: "{relevant_transactions[1]}"
    - Transaction 3: "{relevant_transactions[2]}"

    Use this specific data to provide a concise, helpful, and direct response to the user's message.
    """

    try:
        completion = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5,
            max_tokens=200,
        )
        response_text = completion.choices[0].message.content
        return response_text or "I'm not sure how to respond to that."
    except Exception as e:
        logger.error(f"OpenAI API call failed for user {clerk_id}: {e}")
        return "I'm having trouble connecting to my AI brain right now."


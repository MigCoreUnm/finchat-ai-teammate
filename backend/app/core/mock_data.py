from datetime import date
from app.schemas.transaction import Transaction, TransactionCategory

# A realistic set of transactions to be returned by the 'dumb' endpoint.
mock_transactions: list[Transaction] = [
    Transaction(
        date=date(2025, 9, 12),
        description="Daily Grind Coffee",
        amount=-6.50,
        category=TransactionCategory.FOOD_DRINK,
    ),
    Transaction(
        date=date(2025, 9, 12),
        description="Lyft Ride",
        amount=-15.75,
        category=TransactionCategory.TRANSPORT,
    ),
    Transaction(
        date=date(2025, 9, 11),
        description="Trader Joe's Groceries",
        amount=-85.30,
        category=TransactionCategory.SHOPPING,
    ),
    Transaction(
        date=date(2025, 9, 9),
        description="Movie Ticket",
        amount=-18.00,
        category=TransactionCategory.ENTERTAINMENT,
    ),
]

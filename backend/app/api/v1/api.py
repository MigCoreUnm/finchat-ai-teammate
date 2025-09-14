from fastapi import APIRouter
from .endpoints import transactions, goal, login

api_router = APIRouter()

# Include all the specific routers
api_router.include_router(login.router, prefix ="/login", tags=["Login"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(goal.router, prefix="/goal", tags=["Goal"])

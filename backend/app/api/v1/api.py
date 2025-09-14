from fastapi import APIRouter
from .endpoints import  goal, login, user

api_router = APIRouter()

# Include all the specific routers
api_router.include_router(login.router, prefix="/login", tags=["Login"])
api_router.include_router(user.router, prefix="/user", tags=["Users"])
api_router.include_router(goal.router, prefix="/goal", tags=["Goal"])

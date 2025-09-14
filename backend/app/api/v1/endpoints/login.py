from app.core.models import UserDocument, UserLoginRequest, UserResponse
from app.services.user_service import get_or_create_user
from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db, Database # Assuming 'Database' is your wrapper class

# Create a new router for user-related endpoints
router = APIRouter()

@router.post("/login", response_model=UserResponse)
async def login_and_get_user(
    login_data: UserLoginRequest, 
) -> UserResponse:
    """
    Handles user login by fetching an existing user document from the database
    or creating a new one if the user is signing in for the first time.
    """

    try:
        # The 'db' object is now correctly provided by FastAPI
        exist, user_document = await get_or_create_user( login_data)
        if user_document is None:
             # This can happen if the service layer has an issue but doesn't raise an exception
             raise HTTPException(status_code=404, detail="User could not be found or created.")
        
        final = {"exists":exist}
        return final
    except Exception as e:
        print(f"Error during user login/creation: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An error occurred while processing your login."
        )
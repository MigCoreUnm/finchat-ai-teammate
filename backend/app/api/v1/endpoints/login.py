from app.schemas.db import UserDocumentDB
from app.schemas.user import UserDocument, UserLoginRequest
from app.core.database import Database

async def get_or_create_user(db: Database, login_data: UserLoginRequest) -> UserDocument:
    """
    Service layer function to fetch a user document from MongoDB, or create one if it doesn't exist.
    Handles the translation between database models and API schemas.

    Args:
        db: The database instance.
        login_data: The user login data from the API request.

    Returns:
        The user data as an API schema object (UserDocument).
    """
    users_collection = db.get_collection("users")
    
    # Check if user exists based on Clerk ID
    user_db_data = await users_collection.find_one({"clerk_id": login_data.clerk_id})
    
    if user_db_data:
        # If user exists, parse the DB data into our DB model
        user_db = UserDocumentDB(**user_db_data)
        # Then, convert the DB model into our API schema before returning
        return UserDocument(**user_db.dict())
    
    # If user does not exist, create a new DB model instance
    new_user_db = UserDocumentDB(
        email=login_data.email,
        clerk_id=login_data.clerk_id
    )
    
    # Convert the DB model to a dictionary, excluding the 'id' because MongoDB creates it
    new_user_dict = new_user_db.dict(exclude={"id"})

    await users_collection.insert_one(new_user_dict)
    
    # Return the newly created user data as an API schema object
    return UserDocument(**new_user_db.dict())

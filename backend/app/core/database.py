import motor.motor_asyncio
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from a .env file located in your 'backend' directory
load_dotenv()

# Get the connection string from an environment variable for security.
# This is essential for connecting to a remote MongoDB instance like MongoDB Atlas.
# In your backend/.env file, you should add a line like:
# MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/"
MONGO_URI = os.getenv("MONGO")

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable not set. Please create a .env file in the backend directory.")


class Database:
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None
        self.connected = False

    async def connect(self):
        """Establishes a connection to the MongoDB database."""
        self.client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
        self.db = self.client.finchat  # Your database name is 'finchat'
        self.connected = True
        print("Successfully connected to MongoDB.")

    async def close(self):
        """Closes the connection to the MongoDB database."""
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

    def get_collection(self, name: str) -> motor.motor_asyncio.AsyncIOMotorCollection:
        """
        Retrieves a collection from the database.

        Args:
            name: The name of the collection.

        Returns:
            An instance of the collection.
        """
        if self.connected:
            return self.db[name]
        raise Exception("Database not connected. Call connect() first.")

# Create a single, shared instance of the Database class
db = Database()

async def get_db() -> Database:
    """
    Dependency injection helper to get the shared database instance.
    """
    if not db.connected:
        await db.connect()
    return db


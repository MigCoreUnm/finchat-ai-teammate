from fastapi import APIRouter
from app.schemas.transaction import UserGoal

router = APIRouter()

@router.post("/")
def set_user_goal(goal: UserGoal):
    """
    Sets the user's financial goal.

    **For now, this just accepts the goal and returns a success message.**
    """
    # In a real app, you would save this goal to a database
    print(f"Goal received: {goal.goal_name} - ${goal.target_amount}")
    return {"message": "Goal set successfully", "goal_received": goal}

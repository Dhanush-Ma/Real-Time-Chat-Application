import uuid

import pydantic
from bson.json_util import dumps, loads
from bson.objectid import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from app.database import client

router = APIRouter()


class Login_Credentials(BaseModel):
    model_config = ConfigDict(regex_engine="python-re")
    username: str = Field(pattern=r"^[a-z]+$")
    password: str


db = client.get_database("chat_application")
user_collection = db["users"]


@router.get("/conversation")
async def get_conversation(userId: str, to: str):
    user = user_collection.find_one({"_id": ObjectId(userId)})

    if user is None:
        raise HTTPException(status_code=404, detail="No user found")

    user_dict = dict(user)
    if "conversations" in user_dict and user_dict["conversations"] is not None:
        conversations = list(user_dict["conversations"])
    else:
        conversations = list([])

    conversation = next((x for x in conversations if x["userId"] == userId), None)
    print("conversation", conversation)

    if conversation is None:
        conversationId = uuid.uuid4()
        messages =  []
    else:
        conversationId = ""
        messages = []

    return {"conversationId": conversationId, "messages": messages}

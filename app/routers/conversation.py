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
conversation_collection = db["conversations"]


@router.get("/conversation")
async def get_conversation(conversationId: str):
    conversation = conversation_collection.find_one({"id": conversationId})

    if conversation is None:
        messages = []
    else:
        print(conversation["messages"])
        messages = list(conversation["messages"])

    return {"messages": messages}

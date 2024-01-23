import datetime
import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from ..database import client

router = APIRouter()


class Signin_credrentials(BaseModel):
    model_config = ConfigDict(regex_engine="python-re")
    username: str = Field(pattern=r"^[a-z]+$")
    firstName: str
    lastName: str
    password: str


db = client.get_database("chat_application")
user_collection = db["users"]


@router.post("/signin")
async def signin_user(signin_credrentials: Signin_credrentials):
    user = user_collection.count_documents({"username": signin_credrentials.username})
    print(user)
    if user != 0:
        raise HTTPException(status_code=404, detail="Username already exists")
    signin_credrentials_dict = signin_credrentials.model_dump()
    signin_credrentials_dict["created_at"] = datetime.datetime.now()

    new_user = user_collection.insert_one(signin_credrentials_dict)
    print(new_user.inserted_id)
    return {"id": str(new_user.inserted_id)}

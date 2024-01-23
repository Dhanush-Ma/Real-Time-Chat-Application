import datetime
import os

import pydantic
from bson.json_util import dumps, loads
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from ..database import client

router = APIRouter()


class Login_Credentials(BaseModel):
    model_config = ConfigDict(regex_engine="python-re")
    username: str = Field(pattern=r"^[a-z]+$")
    password: str


db = client.get_database("chat_application")
user_collection = db["users"]


@router.post("/login")
async def login_user(login_credentials: Login_Credentials):
    user = user_collection.find_one({"username": login_credentials.username})

    if user is None:
        raise HTTPException(status_code=404, detail="No user found")

    user_dict = dict(user)
    if login_credentials.password != user_dict["password"]:
        raise HTTPException(status_code=400, detail="Invalid Password")

    id = str(user_dict["_id"])
    user_dict.pop("_id")
    user_dict["id"] = id
    return {"message": "Login successful", "user": user_dict}

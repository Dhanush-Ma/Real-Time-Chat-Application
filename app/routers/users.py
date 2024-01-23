import os
import datetime;

from fastapi import  APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from ..database import client
from bson.json_util import dumps, loads 
import pydantic
from bson.objectid import ObjectId

router = APIRouter()

class Login_Credentials(BaseModel):
    model_config = ConfigDict(regex_engine="python-re")
    username: str = Field(pattern=r"^[a-z]+$")    
    password: str

db = client.get_database("chat_application")
user_collection = db["users"]


@router.get("/users")
async def login_user():
    users = list(user_collection.find())
    users_dict = []
    for user in users:
        user_dict = dict(user)
        id = str(user_dict["_id"])
        user_dict.pop("_id")
        user_dict["id"] = id
        users_dict.append(user_dict)
    return { "users": users_dict}
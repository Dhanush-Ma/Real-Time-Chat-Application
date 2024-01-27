import datetime
import json
import uuid

from bson.objectid import ObjectId
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.models.ConnectionManager import ConnectionManager

from .database import client
from .routers import conversation, login, signin, users, websocket

app = FastAPI(debug=True)
app.include_router(login.router)
app.include_router(signin.router)
app.include_router(users.router)
# app.include_router(websocket.router)
app.include_router(conversation.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"Welcome to chat application"}


manager = ConnectionManager()

db = client.get_database("chat_application")
user_collection = db["users"]
conversation_collection = db["conversations"]


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            message = data
            message_dict = json.loads(message)
            userId, flag, to, type, conversationId = (
                message_dict["userId"],
                message_dict["flag"],
                message_dict["to"],
                message_dict["type"],
                message_dict["conversationId"],
            )
            # print(message_dict["message"])
            if type == "message" or type == "image" or type == "audio":
                conversation_collection.update_one(
                    {"conversationId": conversationId},
                    {
                        "$push": {"messages": message_dict},
                        "$set": {"id": conversationId},
                    },
                    upsert=True,
                )

            await manager.broadcast(message)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        message = {"type": "onlineStatus", "message": "Offline"}
        await manager.broadcast(json.dumps(message))

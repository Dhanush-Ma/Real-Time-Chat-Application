import json
import os
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.models.ConnectionManager import ConnectionManager


router = APIRouter()



@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    manager = ConnectionManager()

    print(client_id)
    await manager.connect(websocket)
    now = datetime.now()
    current_time = now.strftime("%H:%M")
    try:
        while True:
            data = await websocket.receive_text()
            # await manager.send_personal_message(f"You wrote: {data}", websocket)
            message = data
            await manager.broadcast(message)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        message = {"type": "onlineStatus", "message": "Offline"}
        await manager.broadcast(json.dumps(message))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_user_data, save_user_message
from chatbot import Chatbot
from config import get_settings

app = FastAPI()
settings = get_settings()
chatbot = Chatbot(settings)

class Message(BaseModel):
    user_id: str
    text: str

@app.post("/chat/")
async def chat(message: Message):
    try:
        user_data = await get_user_data(message.user_id)
        response = await chatbot.get_response(message.text, user_data)
        await save_user_message(message.user_id, message.text, response)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chatbot API!"}
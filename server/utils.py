import os
from dotenv import load_dotenv

load_dotenv()

def format_message(user: str, message: str) -> str:
    return f"{user}: {message}"

def validate_input(message: str) -> bool:
    return bool(message.strip())

def handle_api_response(response) -> dict:
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API request failed with status code {response.status_code}: {response.text}")
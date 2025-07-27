import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    POSTGRES_DB = os.getenv("POSTGRES_DB")
    POSTGRES_USER = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY")

    @staticmethod
    def validate():
        required_vars = [
            "POSTGRES_DB", "POSTGRES_USER", "POSTGRES_PASSWORD",
            "DB_HOST", "DB_PORT", "GEMINI_API_KEY", "LANGSMITH_API_KEY"
        ]
        for var in required_vars:
            if not os.getenv(var):
                raise ValueError(f"Environment variable '{var}' is not set.")
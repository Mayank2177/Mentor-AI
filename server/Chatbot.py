import os
import json
from datetime import datetime
from typing import List, Dict, Any
from collections import deque

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferWindowMemory
from langchain.schema import HumanMessage, AIMessage
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import ConversationChain
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Configuration
class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_NAME = "gemini-2.0-flash"
    MAX_CONTEXT_MESSAGES = 5
    PORT = 8000
    HOST = "0.0.0.0"

# Pydantic models for API
class ChatMessage(BaseModel):
    message: str
    user_id: str = "default_user"

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    user_id: str

# Educational Instructor Chatbot Class
class EducationalChatbot:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=Config.MODEL_NAME,
            google_api_key=Config.GEMINI_API_KEY,
            temperature=0.3,  # Lower temperature for more consistent educational responses
            convert_system_message_to_human=True
        )
        
        # Store conversation memory for each user
        self.user_memories = {}
        
        # Educational instructor prompt template
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", self._get_system_prompt()),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        
    def _get_system_prompt(self) -> str:
        return """You are an experienced and patient Educational Instructor chatbot designed to help students learn effectively. Your role is to:

🎯 **PRIMARY OBJECTIVES:**
• Provide clear, accurate, and detailed explanations for student queries
• Break down complex concepts into digestible, easy-to-understand parts
• Encourage critical thinking and deeper understanding
• Maintain a supportive and encouraging tone

📝 **RESPONSE FORMAT REQUIREMENTS:**
• Always structure your responses with clear bullet points for better readability
• Use appropriate emojis to make content engaging and visually appealing
• Provide step-by-step explanations when solving problems
• Include examples and analogies to clarify difficult concepts
• End with encouraging words or additional learning suggestions

🧠 **TEACHING PRINCIPLES:**
• Ask clarifying questions when the student's query is unclear
• Provide multiple approaches to solve problems when applicable
• Connect new information to previously discussed topics
• Encourage students to think critically about the subject matter
• Adapt explanations to the student's apparent level of understanding

✨ **COMMUNICATION STYLE:**
• Be patient, kind, and encouraging
• Use simple language but maintain academic accuracy
• Provide comprehensive answers without overwhelming the student
• Show enthusiasm for learning and discovery
• Create a safe space for asking questions

Remember: Every interaction is an opportunity to inspire learning and build confidence in your students!"""

    def get_or_create_memory(self, user_id: str) -> ConversationBufferWindowMemory:
        """Get or create conversation memory for a specific user"""
        if user_id not in self.user_memories:
            self.user_memories[user_id] = ConversationBufferWindowMemory(
                k=Config.MAX_CONTEXT_MESSAGES,
                return_messages=True,
                memory_key="history"
            )
        return self.user_memories[user_id]

    def format_response(self, response: str) -> str:
        """Ensure response follows proper formatting guidelines"""
        # Add some basic formatting if not already present
        if not any(marker in response for marker in ['•', '◦', '▪', '→', '📝', '🎯']):
            # If no bullet points are detected, add basic structure
            lines = response.split('\n')
            formatted_lines = []
            for line in lines:
                if line.strip() and not line.startswith(('•', '◦', '▪', '→')):
                    formatted_lines.append(f"• {line.strip()}")
                else:
                    formatted_lines.append(line)
            response = '\n'.join(formatted_lines)
        
        return response

    async def get_response(self, message: str, user_id: str) -> str:
        """Get chatbot response with context memory"""
        try:
            # Get user's conversation memory
            memory = self.get_or_create_memory(user_id)
            
            # Create conversation chain
            conversation = ConversationChain(
                llm=self.llm,
                prompt=self.prompt_template,
                memory=memory,
                verbose=True
            )
            
            # Get response from the model
            response = await self._async_invoke(conversation, message)
            
            # Format the response to ensure proper structure
            formatted_response = self.format_response(response)
            
            return formatted_response
            
        except Exception as e:
            return f"🚫 **Error occurred:** I apologize, but I encountered an issue while processing your question. Please try rephrasing your query or check if all configurations are correct.\n\n**Error details:** {str(e)}"

    async def _async_invoke(self, conversation, message: str) -> str:
        """Async wrapper for conversation invoke"""
        try:
            result = conversation.invoke({"input": message})
            return result["response"]
        except Exception as e:
            raise Exception(f"Model invocation failed: {str(e)}")

    def get_conversation_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get formatted conversation history for a user"""
        if user_id not in self.user_memories:
            return []
        
        memory = self.user_memories[user_id]
        messages = memory.chat_memory.messages
        
        history = []
        for msg in messages:
            if isinstance(msg, HumanMessage):
                history.append({
                    "type": "human",
                    "content": msg.content,
                    "timestamp": datetime.now().isoformat()
                })
            elif isinstance(msg, AIMessage):
                history.append({
                    "type": "ai",
                    "content": msg.content,
                    "timestamp": datetime.now().isoformat()
                })
        
        return history

    def clear_user_memory(self, user_id: str) -> bool:
        """Clear conversation history for a specific user"""
        if user_id in self.user_memories:
            self.user_memories[user_id].clear()
            return True
        return False

# ====================================
# FASTAPI APPLICATION SETUP
# ====================================
app = FastAPI(
    title="Educational Chatbot API",
    description="LangChain-powered educational chatbot with Gemini API",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI at /docs
    redoc_url="/redoc"  # ReDoc at /redoc
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chatbot
chatbot = EducationalChatbot()

# @app.on_event("startup")
# async def startup_event():
#     """Startup event to validate configuration"""
#     if not Config.GEMINI_API_KEY:
#         raise ValueError("GEMINI_API_KEY environment variable is required")
#     print(f"🚀 Educational Chatbot API started successfully!")
#     print(f"📚 Ready to help students learn and grow!")

# ====================================
# FASTAPI ENDPOINTS
# ====================================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API status"""
    return {
        "message": "🎓 Educational Chatbot API is running!",
        "status": "active",
        "model": Config.MODEL_NAME,
        "context_messages": Config.MAX_CONTEXT_MESSAGES,
        "docs": "/docs",
        "health": "/health"
    }

@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat_endpoint(chat_message: ChatMessage):
    """Main chat endpoint"""
    try:
        response = await chatbot.get_response(
            message=chat_message.message,
            user_id=chat_message.user_id
        )
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now().isoformat(),
            user_id=chat_message.user_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{user_id}", tags=["History"])
async def get_chat_history(user_id: str):
    """Get conversation history for a specific user"""
    history = chatbot.get_conversation_history(user_id)
    return {
        "user_id": user_id,
        "history": history,
        "total_messages": len(history)
    }

@app.delete("/history/{user_id}", tags=["History"])
async def clear_chat_history(user_id: str):
    """Clear conversation history for a specific user"""
    success = chatbot.clear_user_memory(user_id)
    return {
        "user_id": user_id,
        "cleared": success,
        "message": "Conversation history cleared successfully!" if success else "No history found for user"
    }

@app.get("/users", tags=["Users"])
async def get_active_users():
    """Get list of all users with active conversations"""
    return {
        "active_users": list(chatbot.user_memories.keys()),
        "total_users": len(chatbot.user_memories)
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model": Config.MODEL_NAME
    }

# ====================================
# RUN SERVER
# ====================================
if __name__ == "__main__":
    print("🎓 Starting Educational Chatbot Server...")
    print("📋 Make sure to set your GEMINI_API_KEY environment variable!")
    print(f"🌐 Server will run on http://{Config.HOST}:{Config.PORT}")
    
    uvicorn.run(
        "main:app",  # Replace "main" with your actual filename
        host=Config.HOST,
        port=Config.PORT,
        reload=True,
        # log_level="info"
    )

# Example client code for testing
"""
Example usage with requests:

import requests

# Send a chat message
response = requests.post("http://localhost:8000/chat", json={
    "message": "Explain photosynthesis to me",
    "user_id": "student_123"
})

print(response.json())

# Get chat history
history = requests.get("http://localhost:8000/history/student_123")
print(history.json())
"""

# Requirements.txt content:
"""
langchain>=0.1.0
langchain-google-genai>=1.0.0
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.0.0
python-dotenv>=1.0.0
"""
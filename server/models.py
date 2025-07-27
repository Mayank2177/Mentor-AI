from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    chats = relationship("Chat", back_populates="owner")

class Chat(Base):
    __tablename__ = 'chats'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    message = Column(String, index=True)
    response = Column(String, index=True)
    timestamp = Column(String)

    owner = relationship("User", back_populates="chats")
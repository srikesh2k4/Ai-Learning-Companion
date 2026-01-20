Here's the **cleaned and fixed README for ChatGPT/OpenAI API**:

```markdown
# AI Learning Companion

An intelligent, AI-powered learning platform that provides personalized tutoring, practice problems, and progress tracking for students.

## Author

**Kotipalli Srikesh**  
Registration Number: RA2211003010979  
GitHub: [@srikesh2k4](https://github.com/srikesh2k4)

---

## Overview

AI Learning Companion is a full-stack web application designed to help students learn more effectively through AI-powered tutoring. The platform offers interactive chat-based learning, customized practice problems, and detailed progress analytics.

---

## Features

### Core Features
- **AI Tutor Chat** - Interactive conversations with ChatGPT that explains concepts, answers questions, and provides guidance
- **Practice Problems** - AI-generated practice problems with multiple difficulty levels
- **Progress Tracking** - Detailed statistics and analytics on learning progress
- **User Authentication** - Secure JWT-based authentication system

### User Features
- User registration and login
- Profile management with learning goals
- Topic preferences customization
- Conversation history
- Practice session history with scores

### AI Capabilities
- Context-aware responses powered by ChatGPT
- Adaptive difficulty in practice problems
- Detailed feedback on answers
- Markdown-formatted explanations with code highlighting

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | Web framework |
| SQLAlchemy | ORM for database |
| SQLite | Database (async with aiosqlite) |
| Pydantic | Data validation |
| JWT (python-jose) | Authentication |
| bcrypt | Password hashing |
| PydanticAI | AI agent framework |
| OpenAI API | ChatGPT/GPT-4 integration |

### Frontend
| Technology | Purpose |
|------------|---------|
| Angular 21 | Frontend framework |
| TypeScript | Programming language |
| SCSS | Styling |
| RxJS | Reactive programming |
| ngx-markdown | Markdown rendering |

---

## Project Structure

```
ai-learning-companion/
├── backend/
│   ├── api/
│   │   └── index.py              # Main FastAPI application
│   ├── app/
│   │   ├── agents/
│   │   │   ├── tutor_agent.py        # AI tutoring agent
│   │   │   └── problem_generator.py  # AI problem generation
│   │   ├── models/
│   │   │   ├── db_models.py          # SQLAlchemy models
│   │   │   └── schemas.py            # Pydantic schemas
│   │   ├── services/
│   │   │   ├── auth_service.py       # Authentication logic
│   │   │   └── learning_service.py   # Learning features
│   │   ├── config.py                 # Application configuration
│   │   ├── database.py               # Database setup
│   │   ├── dependencies.py           # FastAPI dependencies
│   │   └── middleware.py             # Custom middleware
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   ├── chat/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── practice/
│   │   │   │   ├── profile/
│   │   │   │   └── shared/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   └── services/
│   │   └── styles/
│   ├── angular.json
│   └── package.json
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+
- **Git**
- **OpenAI API Key** (get from [platform.openai.com](https://platform.openai.com))

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/srikesh2k4/Ai-Learning-Companion.git
cd Ai-Learning-Companion
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT Secret Key (generate a secure random string)
SECRET_KEY=your_secret_key_here_use_random_string

# Optional configurations
DEBUG=false
DATABASE_URL=sqlite+aiosqlite:///./learning.db
CORS_ORIGINS=http://localhost:4200,http://127.0.0.1:4200

# JWT Configuration
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

---

## Running the Application

### Start Backend Server

```bash
# From the backend directory with virtual environment activated
cd backend
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows

uvicorn api.index:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`  
API Documentation: `http://localhost:8000/docs`

### Start Frontend Server

```bash
# From the frontend directory (in a new terminal)
cd frontend
ng serve --port 4200
```

Frontend will be available at: `http://localhost:4200`

---

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "password": "SecurePass123",
  "learning_goals": "Learn Python programming"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=SecurePass123
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Conversation Endpoints

#### Create Conversation
```http
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Python Basics"
}
```

#### Send Message
```http
POST /api/conversations/{id}/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Can you explain how loops work in Python?"
}
```

### Practice Endpoints

#### Generate Problem
```http
POST /api/practice/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Python Programming",
  "difficulty": "medium"
}
```

#### Submit Answer
```http
POST /api/practice/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "session_id": 1,
  "answer": "A for loop iterates over a sequence..."
}
```

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Get user learning statistics |
| GET | `/topics` | Get available topics |

---

## Frontend Routes

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/` | Dashboard | Main dashboard with stats | Yes |
| `/login` | Login | User login page | No |
| `/register` | Register | User registration page | No |
| `/chat` | Chat | AI tutor chat interface | Yes |
| `/chat/:id` | Chat | Specific conversation | Yes |
| `/practice` | Practice | Practice problems | Yes |
| `/profile` | Profile | User profile settings | Yes |

---

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | API key for OpenAI ChatGPT | **Yes** | - |
| `SECRET_KEY` | JWT signing secret key | **Yes** | - |
| `DATABASE_URL` | Database connection URL | No | `sqlite+aiosqlite:///./learning.db` |
| `DEBUG` | Enable debug mode | No | `false` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | No | `*` |
| `JWT_ALGORITHM` | JWT signing algorithm | No | `HS256` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | No | `30` |

---

## PydanticAI Configuration

Update your `tutor_agent.py` and `problem_generator.py` to use OpenAI:

```python
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
import os

# Initialize OpenAI model
model = OpenAIChatModel(
    'gpt-4',  # or 'gpt-3.5-turbo' for faster/cheaper responses
    api_key=os.getenv('OPENAI_API_KEY')
)

# Create agent
tutor_agent = Agent(
    model=model,
    system_prompt="You are an expert tutor..."
)
```

---

## Available ChatGPT Models

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| `gpt-4` | Slow | High | Complex reasoning, tutoring |
| `gpt-4-turbo` | Medium | Medium | Balanced performance |
| `gpt-3.5-turbo` | Fast | Low | Quick responses, practice |

---

## Troubleshooting

### Common Issues

**1. Backend won't start**
- Ensure virtual environment is activated
- Check if all dependencies are installed: `pip install -r requirements.txt`
- Verify `.env` file exists with `OPENAI_API_KEY`

**2. Frontend won't compile**
- Clear node modules: `rm -rf node_modules && npm install`
- Clear Angular cache: `rm -rf .angular`

**3. API returns 401 Unauthorized**
- Token may have expired, log in again
- Ensure Authorization header: `Bearer <token>`

**4. OpenAI API errors**
- **Invalid API Key**: Check your key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Rate Limit**: You've exceeded your quota, check usage or upgrade plan
- **Insufficient Quota**: Add credits to your OpenAI account [web:65][web:66][web:73]

**5. CORS errors**
- Update `CORS_ORIGINS` in `.env` to include your frontend URL
- Restart the backend server

---

## Cost Optimization Tips

1. **Use GPT-3.5-Turbo** for practice problems (cheaper)
2. **Use GPT-4** only for complex tutoring
3. **Set token limits** in your requests
4. **Cache frequent responses**

---

## License

This project is created for educational purposes.

---

## Contact

**Kotipalli Srikesh**  
Registration Number: RA2211003010979  
GitHub: [@srikesh2k4](https://github.com/srikesh2k4)
```

## Key Changes Made:

1. **Replaced OpenRouter with OpenAI** throughout [roseford.hashnode](https://roseford.hashnode.dev/integrate-openai-into-a-fastapi-application)
2. **Updated environment variables** to use `OPENAI_API_KEY` [ai.pydantic](https://ai.pydantic.dev/models/openai/)
3. **Added PydanticAI configuration** for OpenAI [ai.pydantic](https://ai.pydantic.dev/api/models/openai/)
4. **Added model selection guide** (GPT-4, GPT-3.5-turbo)
5. **Removed all duplicate content** and repetitions
6. **Added troubleshooting** for OpenAI-specific errors [platform.openai](https://platform.openai.com/docs/quickstart)
7. **Added cost optimization tips**
8. **Cleaned up formatting** for better readability

The README is now **fast to read, accurate, and OpenAI-focused**! [roseford.hashnode](https://roseford.hashnode.dev/integrate-openai-into-a-fastapi-application)
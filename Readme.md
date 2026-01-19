# AI Learning Companion

An intelligent, AI-powered learning platform that provides personalized tutoring, practice problems, and progress tracking for students.

## Author

**Kotipalli Srikesh**  
Registration Number: RA2211003010979

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Routes](#frontend-routes)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

AI Learning Companion is a full-stack web application designed to help students learn more effectively through AI-powered tutoring. The platform offers interactive chat-based learning, customized practice problems, and detailed progress analytics.

---

## Features

### Core Features

- **AI Tutor Chat** - Interactive conversations with an AI tutor that explains concepts, answers questions, and provides guidance
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

- Intelligent tutoring with context-aware responses
- Adaptive difficulty adjustment for practice problems
- Personalized learning recommendations
- Real-time feedback on practice submissions

---

## Tech Stack

### Frontend
- **Angular 21** - Modern web framework with standalone components
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Enhanced CSS with variables and mixins
- **Angular SSR** - Server-side rendering for better performance
- **ngx-markdown** - Markdown rendering for chat messages

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **PydanticAI** - AI agent framework
- **OpenRouter** - AI model provider (NVIDIA Nemotron)

### Security & Authentication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

---

## Project Structure

```
ai-learning-companion/
├── backend/
│   ├── api/
│   │   ├── index.py              # Main FastAPI application
│   │   └── __init__.py
│   ├── app/
│   │   ├── agents/
│   │   │   ├── problem_generator.py  # AI problem generation
│   │   │   ├── tutor_agent.py        # AI tutoring agent
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   ├── db_models.py          # Database models
│   │   │   ├── schemas.py            # Pydantic schemas
│   │   │   └── __init__.py
│   │   ├── services/
│   │   │   ├── auth_service.py       # Authentication logic
│   │   │   ├── learning_service.py   # Learning features
│   │   │   ├── user_service.py       # User management
│   │   │   └── __init__.py
│   │   ├── config.py                 # Application configuration
│   │   ├── database.py               # Database setup
│   │   ├── dependencies.py           # FastAPI dependencies
│   │   ├── middleware.py             # Custom middleware
│   │   └── utils.py                  # Utility functions
│   ├── requirements.txt              # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   ├── login.component.html
│   │   │   │   │   │   ├── login.component.scss
│   │   │   │   │   │   └── login.component.ts
│   │   │   │   │   └── register/
│   │   │   │   │       ├── register.component.html
│   │   │   │   │       ├── register.component.scss
│   │   │   │   │       └── register.component.ts
│   │   │   │   ├── chat/
│   │   │   │   │   ├── chat.component.html
│   │   │   │   │   ├── chat.component.scss
│   │   │   │   │   └── chat.component.ts
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.html
│   │   │   │   │   ├── dashboard.component.scss
│   │   │   │   │   └── dashboard.component.ts
│   │   │   │   ├── practice/
│   │   │   │   │   ├── practice.component.html
│   │   │   │   │   ├── practice.component.scss
│   │   │   │   │   └── practice.component.ts
│   │   │   │   └── profile/
│   │   │   │       ├── profile.component.html
│   │   │   │       ├── profile.component.scss
│   │   │   │       └── profile.component.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── learning.service.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git** for version control

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-learning-companion
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
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Configuration
DATABASE_URL=sqlite:///./ai_learning.db

# Application Configuration
DEBUG=True
CORS_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
```

---

## Running the Application

### Development Mode

1. **Start the Backend:**

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

2. **Start the Frontend:**

```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Build

1. **Build the Frontend:**

```bash
cd frontend
npm run build
```

2. **Run the Backend:**

```bash
cd backend
source venv/bin/activate
uvicorn api.index:app --host 0.0.0.0 --port 8000
```

---

## API Documentation

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "learning_goals": "string (optional)",
  "preferred_topics": ["string"] (optional)
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "learning_goals": "string",
    "preferred_topics": ["string"]
  }
}
```

#### POST `/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "learning_goals": "string",
    "preferred_topics": ["string"]
  }
}
```

### Learning Endpoints

#### GET `/conversations/`
Get user's conversation history.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "integer",
    "title": "string",
    "created_at": "datetime",
    "updated_at": "datetime",
    "message_count": "integer"
  }
]
```

#### POST `/conversations/`
Create a new conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string"
}
```

**Response:**
```json
{
  "id": "integer",
  "title": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "message_count": "integer"
}
```

#### GET `/conversations/{conversation_id}/messages`
Get messages for a specific conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "integer",
    "content": "string",
    "is_user": "boolean",
    "created_at": "datetime"
  }
]
```

#### POST `/conversations/{conversation_id}/messages`
Send a message in a conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "id": "integer",
  "content": "string",
  "is_user": "boolean",
  "created_at": "datetime"
}
```

#### POST `/practice/generate`
Generate practice problems.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "topic": "string",
  "difficulty": "easy|medium|hard",
  "count": "integer (optional, default: 5)"
}
```

**Response:**
```json
{
  "session_id": "string",
  "problems": [
    {
      "id": "string",
      "question": "string",
      "options": ["string"],
      "correct_answer": "string",
      "explanation": "string",
      "topic": "string",
      "difficulty": "string"
    }
  ]
}
```

#### POST `/practice/submit`
Submit answers for practice problems.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "session_id": "string",
  "answers": [
    {
      "problem_id": "string",
      "answer": "string"
    }
  ]
}
```

**Response:**
```json
{
  "session_id": "string",
  "score": "integer",
  "total_questions": "integer",
  "percentage": "float",
  "results": [
    {
      "problem_id": "string",
      "correct": "boolean",
      "user_answer": "string",
      "correct_answer": "string",
      "explanation": "string"
    }
  ]
}
```

#### GET `/analytics/progress`
Get user's learning progress analytics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_conversations": "integer",
  "total_messages": "integer",
  "total_practice_sessions": "integer",
  "average_score": "float",
  "topics_covered": ["string"],
  "recent_activity": [
    {
      "type": "conversation|practice",
      "title": "string",
      "date": "datetime",
      "score": "float (optional)"
    }
  ]
}
```

---

## Frontend Routes

| Route | Component | Description | Authentication Required |
|-------|-----------|-------------|-------------------------|
| `/` | Dashboard | Main dashboard with overview | Yes |
| `/login` | Login | User login page | No |
| `/register` | Register | User registration page | No |
| `/chat` | Chat | AI tutor chat interface | Yes |
| `/practice` | Practice | Practice problems interface | Yes |
| `/profile` | Profile | User profile management | Yes |

---

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENROUTER_API_KEY` | API key for OpenRouter AI service | Yes | - |
| `JWT_SECRET_KEY` | Secret key for JWT token signing | Yes | - |
| `DATABASE_URL` | Database connection URL | No | `sqlite:///./ai_learning.db` |
| `DEBUG` | Enable debug mode | No | `False` |
| `CORS_ORIGINS` | Allowed CORS origins | No | `http://localhost:4200` |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time | No | `30` |

---

## Screenshots

*Add screenshots of the application here once deployed*

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Deployment

*Add deployment instructions and link here once deployed*

---

**Author:** Kotipalli Srikesh  
**Registration Number:** RA2211003010979



## Overview---



AI Learning Companion is a full-stack web application designed to help students learn more effectively through AI-powered tutoring. The platform offers interactive chat-based learning, customized practice problems, and detailed progress analytics.## Overview



---AI Learning Companion is a full-stack web application designed to help students learn more effectively through AI-powered tutoring. The platform offers interactive chat-based learning, customized practice problems, and detailed progress analytics.



## Features---



### Core Features## Features



- **AI Tutor Chat** - Interactive conversations with an AI tutor that explains concepts, answers questions, and provides guidance### Core Features

- **Practice Problems** - AI-generated practice problems with multiple difficulty levels

- **Progress Tracking** - Detailed statistics and analytics on learning progress- **AI Tutor Chat** - Interactive conversations with an AI tutor that explains concepts, answers questions, and provides guidance

- **User Authentication** - Secure JWT-based authentication system- **Practice Problems** - AI-generated practice problems with multiple difficulty levels

- **Progress Tracking** - Detailed statistics and analytics on learning progress

### User Features- **User Authentication** - Secure JWT-based authentication system



- User registration and login### User Features

- Profile management with learning goals

- Topic preferences customization- User registration and login

- Conversation history- Profile management with learning goals

- Practice session history with scores- Topic preferences customization

- Conversation history

### AI Capabilities- Practice session history with scores



- Context-aware responses### AI Capabilities

- Adaptive difficulty in practice problems

- Detailed feedback on answers- Context-aware responses

- Markdown-formatted explanations with code highlighting- Adaptive difficulty in practice problems

- Detailed feedback on answers

---- Markdown-formatted explanations with code highlighting



## Tech Stack---



### Backend## Tech Stack



| Technology | Purpose |### Backend

|------------|---------|

| FastAPI | Web framework || Technology | Purpose |

| SQLAlchemy | ORM for database ||------------|---------|

| SQLite | Database (async with aiosqlite) || FastAPI | Web framework |

| Pydantic | Data validation || SQLAlchemy | ORM for database |

| JWT (python-jose) | Authentication || SQLite | Database (async with aiosqlite) |

| bcrypt | Password hashing || Pydantic | Data validation |

| PydanticAI | AI agent framework || JWT (python-jose) | Authentication |

| OpenRouter | LLM API provider || bcrypt | Password hashing |

| PydanticAI | AI agent framework |

### Frontend| OpenRouter | LLM API provider |



| Technology | Purpose |### Frontend

|------------|---------|

| Angular 21 | Frontend framework || Technology | Purpose |

| TypeScript | Programming language ||------------|---------|

| SCSS | Styling || Angular 21 | Frontend framework |

| RxJS | Reactive programming || TypeScript | Programming language |

| ngx-markdown | Markdown rendering || SCSS | Styling |

| RxJS | Reactive programming |

---| ngx-markdown | Markdown rendering |



## Project Structure---



```## Project Structure

ai-learning-companion/

├── backend/```

│   ├── api/ai-learning-companion/

│   │   └── index.py├── backend/

│   ├── app/│   ├── api/

│   │   ├── agents/│   │   └── index.py          # Main FastAPI application

│   │   │   ├── tutor_agent.py│   ├── app/

│   │   │   └── problem_generator.py│   │   ├── agents/

│   │   ├── models/│   │   │   ├── tutor_agent.py

│   │   │   ├── db_models.py│   │   │   └── problem_generator.py

│   │   │   └── schemas.py│   │   ├── models/

│   │   ├── services/│   │   │   ├── db_models.py  # SQLAlchemy models

│   │   │   ├── auth_service.py│   │   │   └── schemas.py    # Pydantic schemas

│   │   │   └── learning_service.py│   │   ├── services/

│   │   ├── config.py│   │   │   ├── auth_service.py

│   │   ├── database.py│   │   │   └── learning_service.py

│   │   ├── dependencies.py│   │   ├── config.py

│   │   └── middleware.py│   │   ├── database.py

│   ├── requirements.txt│   │   ├── dependencies.py

│   └── .env│   │   └── middleware.py

├── frontend/│   ├── requirements.txt

│   ├── src/│   └── .env

│   │   ├── app/├── frontend/

│   │   │   ├── components/│   ├── src/

│   │   │   │   ├── auth/│   │   ├── app/

│   │   │   │   ├── chat/│   │   │   ├── components/

│   │   │   │   ├── dashboard/│   │   │   │   ├── auth/

│   │   │   │   ├── practice/│   │   │   │   ├── chat/

│   │   │   │   ├── profile/│   │   │   │   ├── dashboard/

│   │   │   │   └── shared/│   │   │   │   ├── practice/

│   │   │   ├── guards/│   │   │   │   ├── profile/

│   │   │   ├── interceptors/│   │   │   │   └── shared/

│   │   │   ├── models/│   │   │   ├── guards/

│   │   │   └── services/│   │   │   ├── interceptors/

│   │   └── styles/│   │   │   ├── models/

│   ├── angular.json│   │   │   └── services/

│   └── package.json│   │   └── styles/

├── .gitignore│   ├── angular.json

└── README.md│   └── package.json

```├── .gitignore

└── README.md

---```



## Prerequisites---



Ensure you have the following installed:## Prerequisites



- **Python** 3.10 or higherEnsure you have the following installed:

- **Node.js** 18 or higher

- **npm** 9 or higher- **Python** 3.10 or higher

- **Git**- **Node.js** 18 or higher

- **npm** 9 or higher

---- **Git**



## Installation---



### 1. Clone the Repository## Installation



```bash### 1. Clone the Repository

git clone https://github.com/srikesh2k4/Ai-Learning-Companion.git

cd Ai-Learning-Companion```bash

```git clone https://github.com/srikesh2k4/Ai-Learning-Companion.git

cd Ai-Learning-Companion

### 2. Backend Setup```



```bash### 2. Backend Setup

cd backend

```bash

# Create virtual environment# Navigate to backend directory

python -m venv venvcd backend



# Activate virtual environment# Create virtual environment

# On macOS/Linux:python -m venv venv

source venv/bin/activate

# On Windows:# Activate virtual environment

venv\Scripts\activate# On macOS/Linux:

source venv/bin/activate

# Install dependencies# On Windows:

pip install -r requirements.txtvenv\Scripts\activate

```

# Install dependencies

### 3. Configure Environment Variablespip install -r requirements.txt

```

Create a `.env` file in the `backend` directory:

### 3. Configure Environment Variables

```env

OPENROUTER_API_KEY=your_openrouter_api_keyCreate a `.env` file in the `backend` directory:

SECRET_KEY=your_secret_key_here

DEBUG=false```env

DATABASE_URL=sqlite+aiosqlite:///./learning.db# OpenRouter API Key (get from https://openrouter.ai)

```OPENROUTER_API_KEY=your_openrouter_api_key



### 4. Frontend Setup# JWT Secret Key (generate a secure random string)

SECRET_KEY=your_secret_key_here

```bash

cd ../frontend# Optional configurations

DEBUG=false

# Install dependenciesDATABASE_URL=sqlite+aiosqlite:///./learning.db

npm install```

```

### 4. Frontend Setup

---

```bash

## Running the Application# Navigate to frontend directory

cd ../frontend

### Start Backend Server

# Install dependencies

```bashnpm install

cd backend```

source venv/bin/activate

uvicorn api.index:app --reload --port 8000---

```

## Running the Application

Backend runs at: `http://localhost:8000`

### Start Backend Server

### Start Frontend Server

```bash

```bash# From the backend directory with virtual environment activated

cd frontendcd backend

ng serve --port 4200source venv/bin/activate  # macOS/Linux

```uvicorn api.index:app --reload --port 8000

```

Frontend runs at: `http://localhost:4200`

Backend will be available at: `http://localhost:8000`

---

### Start Frontend Server

## API Documentation

```bash

### Base URL# From the frontend directory (in a new terminal)

cd frontend

```ng serve --port 4200

http://localhost:8000/api```

```

Frontend will be available at: `http://localhost:4200`

### Authentication Endpoints

---

| Method | Endpoint | Description |

|--------|----------|-------------|## API Documentation

| POST | `/auth/register` | Register a new user |

| POST | `/auth/login` | Login and get JWT token |### Base URL

| GET | `/auth/me` | Get current user info |

| PUT | `/auth/profile` | Update user profile |```

http://localhost:8000/api

### Conversation Endpoints```



| Method | Endpoint | Description |### Authentication Endpoints

|--------|----------|-------------|

| GET | `/conversations` | Get all user conversations || Method | Endpoint | Description |

| POST | `/conversations` | Create new conversation ||--------|----------|-------------|

| GET | `/conversations/{id}` | Get conversation with messages || POST | `/auth/register` | Register a new user |

| POST | `/conversations/{id}/messages` | Send message and get AI response || POST | `/auth/login` | Login and get JWT token |

| GET | `/auth/me` | Get current user info |

### Practice Endpoints| PUT | `/auth/profile` | Update user profile |



| Method | Endpoint | Description |#### Register User

|--------|----------|-------------|

| POST | `/practice/generate` | Generate a practice problem |```http

| POST | `/practice/submit` | Submit answer for evaluation |POST /api/auth/register

| GET | `/practice/history` | Get practice session history |Content-Type: application/json



### Analytics Endpoints{

  "username": "johndoe",

| Method | Endpoint | Description |  "email": "john@example.com",

|--------|----------|-------------|  "full_name": "John Doe",

| GET | `/stats` | Get user learning statistics |  "password": "SecurePass123",

| GET | `/topics` | Get available topics |  "learning_goals": "Learn Python programming"

}

---```



## Frontend Routes#### Login



| Route | Component | Description | Auth Required |```http

|-------|-----------|-------------|---------------|POST /api/auth/login

| `/login` | LoginComponent | User login page | No |Content-Type: application/x-www-form-urlencoded

| `/register` | RegisterComponent | User registration page | No |

| `/dashboard` | DashboardComponent | Main dashboard with stats | Yes |username=johndoe&password=SecurePass123

| `/chat` | ChatComponent | AI tutor chat interface | Yes |```

| `/chat/:id` | ChatComponent | Specific conversation | Yes |

| `/practice` | PracticeComponent | Practice problems | Yes |### Conversation Endpoints

| `/profile` | ProfileComponent | User profile settings | Yes |

| Method | Endpoint | Description |

---|--------|----------|-------------|

| GET | `/conversations` | Get all user conversations |

## Environment Variables| POST | `/conversations` | Create new conversation |

| GET | `/conversations/{id}` | Get conversation with messages |

### Backend (.env)| POST | `/conversations/{id}/messages` | Send message and get AI response |



| Variable | Description | Required |#### Create Conversation

|----------|-------------|----------|

| `OPENROUTER_API_KEY` | API key for OpenRouter LLM service | Yes |```http

| `SECRET_KEY` | JWT signing secret key | Yes |POST /api/conversations

| `DATABASE_URL` | Database connection URL | No |Authorization: Bearer <token>

| `DEBUG` | Enable debug mode | No |Content-Type: application/json



---{

  "title": "Python Basics"

## Available Topics}

```

- Python Programming

- Data Structures#### Send Message

- Algorithms

- Web Development```http

- Machine LearningPOST /api/conversations/1/messages

- Database DesignAuthorization: Bearer <token>

- System DesignContent-Type: application/json

- Mathematics

- Statistics{

- Computer Networks  "content": "Can you explain how loops work in Python?"

}

---```



## Troubleshooting### Practice Endpoints



**Backend won't start**| Method | Endpoint | Description |

- Ensure virtual environment is activated|--------|----------|-------------|

- Check if `.env` file exists with required variables| POST | `/practice/generate` | Generate a practice problem |

| POST | `/practice/submit` | Submit answer for evaluation |

**Frontend won't compile**| GET | `/practice/history` | Get practice session history |

- Clear node modules: `rm -rf node_modules && npm install`

#### Generate Problem

**API returns 401 Unauthorized**

- Token may have expired, try logging in again```http

POST /api/practice/generate

---Authorization: Bearer <token>

Content-Type: application/json

## License

{

This project is created for educational purposes.  "topic": "Python Programming",

  "difficulty": "medium"

---}

```

## Contact

#### Submit Answer

**Kotipalli Srikesh**  

Registration Number: RA2211003010979  ```http

GitHub: [@srikesh2k4](https://github.com/srikesh2k4)POST /api/practice/submit

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

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |

---

## Frontend Routes

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/login` | LoginComponent | User login page | No |
| `/register` | RegisterComponent | User registration page | No |
| `/dashboard` | DashboardComponent | Main dashboard with stats | Yes |
| `/chat` | ChatComponent | AI tutor chat interface | Yes |
| `/chat/:id` | ChatComponent | Specific conversation | Yes |
| `/practice` | PracticeComponent | Practice problems | Yes |
| `/profile` | ProfileComponent | User profile settings | Yes |

---

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | API key for OpenRouter LLM service | Yes |
| `SECRET_KEY` | JWT signing secret key | Yes |
| `DATABASE_URL` | Database connection URL | No (defaults to SQLite) |
| `DEBUG` | Enable debug mode | No (defaults to false) |
| `CORS_ORIGINS` | Allowed CORS origins | No (defaults to *) |

---

## Data Models

### User

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  learning_goals?: string;
  preferred_topics?: string[];
  created_at: string;
}
```

### Conversation

```typescript
interface Conversation {
  id: number;
  title: string;
  topic?: string;
  created_at: string;
  message_count: number;
}
```

### Message

```typescript
interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
```

### PracticeSession

```typescript
interface PracticeSession {
  id: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  problem_text: string;
  user_answer?: string;
  is_correct?: boolean;
  feedback?: string;
  score?: number;
  created_at: string;
}
```

---

## Available Topics

- Python Programming
- Data Structures
- Algorithms
- Web Development
- Machine Learning
- Database Design
- System Design
- Mathematics
- Statistics
- Computer Networks

---

## Troubleshooting

### Common Issues

**1. Backend won't start**
- Ensure virtual environment is activated
- Check if all dependencies are installed: `pip install -r requirements.txt`
- Verify `.env` file exists with required variables

**2. Frontend won't compile**
- Clear node modules: `rm -rf node_modules && npm install`
- Clear Angular cache: `rm -rf .angular`

**3. API returns 401 Unauthorized**
- Token may have expired, try logging in again
- Ensure Authorization header is set correctly

**4. AI responses are slow or failing**
- Check OpenRouter API key is valid
- Verify internet connection
- Check OpenRouter service status

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

---

## License

This project is created for educational purposes.

---

## Contact

**Kotipalli Srikesh**  
Registration Number: RA2211003010979

GitHub: [@srikesh2k4](https://github.com/srikesh2k4)

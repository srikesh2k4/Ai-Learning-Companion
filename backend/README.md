# 🎓 AI Learning Companion - Backend

A FastAPI-powered AI learning assistant backend that provides personalized tutoring, practice problem generation, and learning analytics using generative AI.

## 🚀 Features

- **🤖 AI Study Assistant** - Intelligent tutoring powered by OpenRouter AI models
- **📝 Practice Problem Generator** - Auto-generates problems with hints and solutions
- **📊 Learning Analytics** - Track progress and performance over time
- **🔐 JWT Authentication** - Secure user registration and login
- **💾 SQLite Database** - Persistent storage with async SQLAlchemy

## 📁 Project Structure

```
backend/
├── api/
│   ├── __init__.py
│   └── index.py              # Main FastAPI application & routes
├── app/
│   ├── __init__.py
│   ├── config.py             # Application settings (pydantic-settings)
│   ├── database.py           # Async SQLAlchemy database setup
│   ├── dependencies.py       # FastAPI dependencies (auth, etc.)
│   ├── middleware.py         # Custom middleware (logging, CORS)
│   ├── utils.py              # Utility functions
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── tutor_agent.py    # AI Tutor using pydantic-ai
│   │   └── problem_generator.py  # Problem generation agent
│   ├── models/
│   │   ├── __init__.py
│   │   ├── db_models.py      # SQLAlchemy ORM models
│   │   └── schemas.py        # Pydantic request/response schemas
│   └── services/
│       ├── __init__.py
│       ├── auth_service.py   # Authentication logic
│       └── learning_service.py  # Learning/conversation logic
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## 🛠️ Installation

### Prerequisites

- Python 3.11+
- pip or uv package manager

### Setup

1. **Clone and navigate to the backend directory:**
   ```bash
   cd ai-learning-companion/backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   JWT_SECRET_KEY=your_secure_random_secret_key
   ```

5. **Run the server:**
   ```bash
   uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
   ```

## 📚 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check & status |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Conversations (AI Chat)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/conversations` | Start new conversation |
| GET | `/api/conversations` | List user conversations |
| GET | `/api/conversations/{id}` | Get conversation with messages |
| POST | `/api/conversations/{id}/messages` | Send message & get AI response |

### Practice Problems
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/practice/generate` | Generate a practice problem |
| POST | `/api/practice/submit` | Submit and evaluate answer |
| GET | `/api/practice/history` | Get practice history |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get learning statistics |

## 🧪 API Testing

### Using curl

**Register a user:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "student1", "email": "student@example.com", "password": "MyPassword123", "full_name": "Test Student"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=student1&password=MyPassword123"
```

**Chat with AI Tutor:**
```bash
TOKEN="your_jwt_token_here"

# Create conversation
curl -X POST http://localhost:8000/api/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Math Help"}'

# Send message
curl -X POST http://localhost:8000/api/conversations/1/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Explain quadratic equations"}'
```

**Generate Practice Problem:**
```bash
curl -X POST http://localhost:8000/api/practice/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Algebra", "difficulty": "medium"}'
```

### Interactive API Docs

Visit `http://localhost:8000/docs` for Swagger UI documentation.

## ⚙️ Configuration

Environment variables (`.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key for AI models | Required |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | Required |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `1440` |
| `DATABASE_URL` | SQLite database URL | `sqlite+aiosqlite:///./learning.db` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `DEBUG` | Enable debug mode | `false` |

## 🔧 Development

**Run with auto-reload:**
```bash
uvicorn api.index:app --reload --port 8000
```

**Run tests (if configured):**
```bash
pytest
```

**Format code:**
```bash
black .
isort .
```

## 🏗️ Tech Stack

- **FastAPI** - Modern async web framework
- **SQLAlchemy 2.0** - Async ORM with SQLite
- **Pydantic v2** - Data validation
- **pydantic-ai** - AI agent framework
- **OpenRouter** - AI model provider
- **python-jose** - JWT handling
- **bcrypt** - Password hashing

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

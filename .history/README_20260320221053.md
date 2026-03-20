# ProtoPy — Python Prototype Generator

> An AI-powered full-stack web application that generates structured Python prototypes from natural language descriptions.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Pages & Routes](#pages--routes)
- [Code Generation Matrix](#code-generation-matrix)
- [How to Use the App](#how-to-use-the-app)
- [How Generated Code is Structured](#how-generated-code-is-structured)
- [Admin Panel](#admin-panel)
- [Troubleshooting](#troubleshooting)
- [Production Notes](#production-notes)

---

## Overview

ProtoPy lets you describe a project idea in plain English, choose a project type and complexity level, and instantly receive a fully structured Python prototype. The code streams in real time with syntax highlighting, and can be copied or downloaded as a `.py` file.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18.x |
| Build Tool | Vite | 6.x |
| Styling | Tailwind CSS | v4 |
| Code Editor | CodeMirror 6 | 4.x |
| HTTP Client | Axios | 1.x |
| Backend | Django + DRF | 4.2.7 |
| Auth | djangorestframework-simplejwt | 5.4.0 |
| Database | SQLite | (dev) |
| CORS | django-cors-headers | 4.3.1 |

---

## Project Structure

```
Full stack project/
│
├── backend/                              # Django REST Framework backend
│   ├── core/                             # Django project configuration
│   │   ├── __init__.py
│   │   ├── settings.py                   # All settings: DB, JWT, CORS, apps
│   │   ├── urls.py                       # Root URL router
│   │   └── wsgi.py                       # WSGI entry point
│   │
│   ├── users/                            # Authentication Django app
│   │   ├── migrations/                   # Database migrations
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── admin.py                      # User model registered in admin
│   │   ├── models.py                     # Custom User model (email login)
│   │   ├── serializers.py                # RegisterSerializer + UserSerializer
│   │   ├── urls.py                       # Auth URL patterns
│   │   └── views.py                      # Register, Login, Logout, Me views
│   │
│   ├── generator/                        # Code generation Django app
│   │   ├── migrations/                   # Database migrations
│   │   │   └── 0001_initial.py
│   │   ├── __init__.py
│   │   ├── admin.py                      # GenerationHistory in admin
│   │   ├── ai_engine.py                  # Core code generation logic
│   │   ├── models.py                     # GenerationHistory model
│   │   ├── serializers.py                # GenerationHistorySerializer
│   │   ├── urls.py                       # Generator URL patterns
│   │   └── views.py                      # Generate, Stream, History views
│   │
│   ├── db.sqlite3                        # SQLite database (auto-created)
│   ├── manage.py                         # Django management CLI
│   └── requirements.txt                  # Python dependencies
│
├── frontend/                             # React + TypeScript frontend
│   ├── public/                           # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts                  # Axios instance + JWT interceptor
│   │   │   └── endpoints.ts              # All API functions (login, register, generate...)
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.tsx                # Top navigation bar
│   │   │   └── ProtectedRoute.tsx        # Redirects unauthenticated users to /login
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx           # Global user state + token management
│   │   │   └── ThemeContext.tsx          # Dark/light mode (persisted to localStorage)
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.tsx               # Home page: hero, features, code preview
│   │   │   ├── Login.tsx                 # Login form with validation
│   │   │   ├── Signup.tsx                # Registration form with validation
│   │   │   └── Dashboard.tsx             # Main app: input + streaming output + history
│   │   │
│   │   ├── App.tsx                       # Route definitions
│   │   ├── main.tsx                      # React DOM entry point
│   │   └── index.css                     # Tailwind imports + CSS variables
│   │
│   ├── index.html                        # HTML entry point
│   ├── vite.config.ts                    # Vite config + Tailwind + /api proxy
│   ├── tsconfig.json                     # TypeScript config
│   └── package.json                      # Frontend dependencies
│
└── README.md                             # This file
```

---

## Prerequisites

Make sure you have the following installed:

- **Python** 3.10 or higher → https://www.python.org/downloads/
- **Node.js** 18 or higher → https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** (optional)

Verify installations:
```bash
python --version
node --version
npm --version
```

---

## Backend Setup

### Step 1 — Navigate to backend folder
```bash
cd "Full stack project/backend"
```

### Step 2 — Create a virtual environment
```bash
python -m venv venv
```

### Step 3 — Activate the virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 4 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 5 — Run database migrations
```bash
python manage.py makemigrations users
python manage.py makemigrations generator
python manage.py migrate
```

### Step 6 — Create an admin user (optional)
```bash
python manage.py createsuperuser
```
Enter your email, username, and a password (min 8 characters).

### Step 7 — Start the backend server
```bash
python manage.py runserver
```

Backend is now running at: **http://localhost:8000**

---

## Frontend Setup

Open a **new terminal** (keep the backend running).

### Step 1 — Navigate to frontend folder
```bash
cd "Full stack project/frontend"
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the dev server
```bash
npm run dev
```

Frontend is now running at: **http://localhost:5173**

---

## Running the Project

You need **two terminals running simultaneously**:

| Terminal | Command | URL |
|----------|---------|-----|
| Terminal 1 (Backend) | `python manage.py runserver` | http://localhost:8000 |
| Terminal 2 (Frontend) | `npm run dev` | http://localhost:5173 |

Open **http://localhost:5173** in your browser to use the app.

---

## API Endpoints

All API endpoints are prefixed with `/api/`.

### Auth Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register/` | No | Register a new user |
| POST | `/api/auth/login/` | No | Login — returns access + refresh tokens + user |
| POST | `/api/auth/logout/` | Yes | Logout + blacklist refresh token |
| GET | `/api/auth/me/` | Yes | Get current logged-in user info |
| POST | `/api/auth/token/refresh/` | No | Get new access token using refresh token |

### Generator Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/generate/` | Yes | Generate code (full response at once) |
| POST | `/api/generate/stream/` | Yes | Generate code (real-time streaming SSE) |
| GET | `/api/history/` | Yes | Get last 20 generations for current user |

### Request Body for `/api/generate/` and `/api/generate/stream/`

```json
{
  "idea": "A task management app with user authentication",
  "project_type": "Website",
  "complexity": "Intermediate"
}
```

---

## Pages & Routes

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Landing | No | Hero section, features, code preview |
| `/login` | Login | No | Email + password login form |
| `/signup` | Sign Up | No | Registration form |
| `/dashboard` | Dashboard | Yes | Code generator interface |

---

## Code Generation Matrix

The `ai_engine.py` generates different Python code based on the combination of **Project Type** and **Complexity**:

| | Simple | Intermediate | Advanced |
|---|--------|-------------|----------|
| **Website** | Flask basic app with routes | Flask + REST API + vanilla JS frontend | Flask + SQLAlchemy + JWT auth |
| **Mobile App** | FastAPI basic CRUD | FastAPI + user profiles + feed | FastAPI + SQLAlchemy + OAuth2 |
| **Full Stack** | Django basic views + models | Django REST Framework + ViewSets | Django + Celery + Redis + filters |

---

## How to Use the App

### 1. Create an Account
- Go to **http://localhost:5173/signup**
- Enter your email, username, and password (min 8 characters)
- You'll be redirected to the Dashboard automatically

### 2. Generate Code
- On the Dashboard, type your project idea in the text box
  - Example: *"A blog platform where users can write and publish posts"*
- Select a **Project Type**: Website, Mobile App, or Full Stack
- Select a **Complexity**: Simple, Intermediate, or Advanced
- Click **Generate Code**
- Watch the Python code stream in with syntax highlighting

### 3. Use the Generated Code
- Click **Copy** to copy the code to clipboard
- Click **Download** to save it as a `.py` file
- The file is named after your idea automatically

### 4. View History
- Click **History** button on the Dashboard
- See your last 20 generated prototypes
- Click any history item to reload that code and settings

### 5. Dark / Light Mode
- Click the sun/moon icon in the Navbar to toggle themes
- Your preference is saved automatically

---

## How Generated Code is Structured

Every generated file follows this structure:

```python
"""
ProtoPy Generated Code
Project: <your idea>
Type: <Website / Mobile App / Full Stack>
Complexity: <Simple / Intermediate / Advanced>
Generated by: ProtoPy - Python Prototype Generator
"""

# Imports
# Models / Database setup
# Routes / Endpoints
# Main entry point
```

### Example — Website / Simple
Generates a **Flask** app with basic routes and an HTML template.

### Example — Website / Advanced
Generates a **Flask + SQLAlchemy + JWT** app with:
- User model with password hashing
- Register + Login endpoints
- Protected routes using JWT
- Post model with CRUD

### Example — Full Stack / Advanced
Generates a **Django + Celery + Redis** app with:
- Custom User model
- Project + Comment models with relationships
- DRF ViewSets with filtering, search, ordering
- Async Celery tasks for notifications
- Role-based access (owner vs collaborator)

---

## Admin Panel

Access the Django Admin at **http://localhost:8000/admin**

You can manage:
- **Users** — view, edit, promote to staff/superuser
- **Generation History** — see all generated code per user
- **Token Blacklist** — view invalidated JWT tokens

To create an admin account:
```bash
python manage.py createsuperuser
```

To promote an existing user to admin via shell:
```bash
python manage.py shell
```
```python
from users.models import User
u = User.objects.get(email='your@email.com')
u.is_staff = True
u.is_superuser = True
u.set_password('NewPassword@123')
u.save()
exit()
```

---

## Troubleshooting

### `ModuleNotFoundError: No module named 'pkg_resources'`
```bash
pip install --upgrade setuptools
pip install -r requirements.txt
```

### `User matching query does not exist` on token refresh
Old tokens in browser from a deleted user. Clear them:
```js
// Run in browser console (F12)
localStorage.clear()
```
Then refresh the page.

### Login returns 401
- Make sure you're using the email you registered with
- Password is case-sensitive
- If you forgot the password, reset it via Django shell (see Admin Panel section)

### CORS errors in browser
Make sure the backend is running on port **8000** and frontend on **5173**. Both are pre-configured in `settings.py`.

### `npm install` takes too long or fails
```bash
npm cache clean --force
npm install
```

### Port already in use
```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## Production Notes

For deploying to production, update these settings in `backend/core/settings.py`:

```python
DEBUG = False
SECRET_KEY = 'your-strong-random-secret-key'
ALLOWED_HOSTS = ['yourdomain.com']
CORS_ALLOWED_ORIGINS = ['https://yourdomain.com']
```

And build the frontend:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` — serve them with Nginx or any static file server.

---

## License

Built with React + Django. Free to use and modify.

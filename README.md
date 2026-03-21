# ProtoPy — Python Prototype Generator

> An AI-powered web app that generates structured Python prototypes from natural language descriptions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Code Editor | CodeMirror 6 |
| Backend | Django 4.2 + DRF |
| Auth | SimpleJWT |
| Database | SQLite |

---

## Project Structure

```
Full stack project/
├── backend/
│   ├── core/            # Settings, URLs, WSGI
│   ├── users/           # Auth (register, login, logout)
│   ├── generator/       # Code generation + history
│   │   └── ai_engine.py # Core generation logic
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── api/         # Axios + API endpoints
│       ├── components/  # Navbar, ProtectedRoute
│       ├── context/     # Auth + Theme context
│       └── pages/       # Landing, Login, Signup, Dashboard
│
└── README.md
```

---

## Setup & Run

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py makemigrations users
python manage.py makemigrations generator
python manage.py migrate
python manage.py runserver   # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

> Keep both terminals running simultaneously.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Register user |
| POST | `/api/auth/login/` | No | Login + get tokens |
| POST | `/api/auth/logout/` | Yes | Logout |
| GET | `/api/auth/me/` | Yes | Current user |
| POST | `/api/generate/` | Yes | Generate code |
| POST | `/api/generate/stream/` | Yes | Stream code (SSE) |
| GET | `/api/history/` | Yes | Generation history |

---

## Code Generation Matrix

| | Simple | Intermediate | Advanced |
|---|--------|-------------|----------|
| **Website** | Flask basic | Flask + REST API | Flask + SQLAlchemy + JWT |
| **Mobile App** | FastAPI basic | FastAPI + profiles | FastAPI + OAuth2 |
| **Full Stack** | Django basic | Django + DRF | Django + Celery + Redis |

---

## Admin Panel

```bash
python manage.py createsuperuser
# Visit: http://localhost:8000/admin
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `No module named 'pkg_resources'` | `pip install --upgrade setuptools` |
| `User does not exist` on refresh | Run `localStorage.clear()` in browser console |
| Login returns 401 | Check email + password (case-sensitive) |
| Port in use | `taskkill /PID <PID> /F` |

---

## License

Built with React + Django. Free to use and modify.

# 🚀 FINLEY – Full Stack Project (FastAPI + Next.js)

Finley is a modern full-stack web application built with **FastAPI** (Python) for the backend and **Next.js (React + TypeScript)** for the frontend.  
It demonstrates secure authentication, dynamic data management, and a production-ready architecture with clean UI/UX design.

---


## ⚙️ Backend Setup (FastAPI)

### 1️⃣ Create a virtual environment
```
python -m venv .venv
.venv\Scripts\activate # for Windows
```

### 2️⃣ Install dependencies
```
pip install -r requirements.txt
```

### 3️⃣ Run the backend
```
uvicorn main:app --reload
```

✅ **Backend runs at:** [http://127.0.0.1:8000]

---

## 💻 Frontend Setup (Next.js)

### 1️⃣ Move into the frontend folder

```
cd frontend
```

### 2️⃣ Install Node packages
```
npm install
```

### 3️⃣ Run the frontend
```
npm run dev
```

✅ **Frontend runs at:** [http://localhost:3000](http://localhost:3000)

---

## 🔑 Features

### 🧠 Backend (FastAPI)
- User registration and login with JWT authentication  
- Password hashing (bcrypt)  
- Secure token validation and user session management  
- Profile endpoint (`/me`)  
- Splitter data persistence (SQLite / JSON)  
- CORS enabled for frontend communication  

### 🎨 Frontend (Next.js + Tailwind CSS)
- Fully responsive UI  
- Login and register pages connected to FastAPI backend  
- Protected dashboard using JWT-based authentication  
- Dynamic navbar that toggles between Login/Register and Profile/Logout  

---

## 🧰 Tech Stack

| Layer      | Technology                     |
|-------------|--------------------------------|
| Frontend    | Next.js, React, Tailwind CSS   |
| Backend     | FastAPI, Python, SQLAlchemy    |
| Database    | SQLite (default)               |
| Auth        | JWT (Python-JOSE, Passlib)     |
| API Docs    | Swagger UI (auto-generated)    |

---

---

## 🧑‍💻 Author

**Sangeeth Santhosh**  
🌐 [LinkedIn](#)  
**K.Pranav**
🌐 [LinkedIn](#)  

---

## 🪄 License

This project is open source and available under the **MIT License**.



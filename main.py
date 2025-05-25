from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

# Разрешаем CORS (чтобы фронтенд мог обращаться к API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене замени на конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Корневой маршрут (чтобы не было 404)
@app.get("/")
def read_root():
    return {"message": "FarmGuard API is running"}

# Маршрут для запуска отслеживания
@app.post("/api/start-tracking")
def start_tracking():
    subprocess.Popen(["python", "track.py"])
    return {"status": "tracking started"}
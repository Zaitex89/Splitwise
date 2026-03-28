from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import Base, engine
from routes.groups import router as group_router
from routes.balances import router as balance_router
from routes.expenses import router as expense_router
from routes.users import router as user_router


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(group_router)
app.include_router(balance_router)
app.include_router(expense_router)
app.include_router(user_router)

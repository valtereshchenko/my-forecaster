from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient
from routes import router as product_router
from fastapi.middleware.cors import CORSMiddleware
# TODO add all the dependncies to the requirements.txt (including greykite)

config = dotenv_values(".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(config["ATLAS_URI"])
    app.database = app.mongodb_client[config["DB_NAME"]]


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


app.include_router(product_router, tags=["products"], prefix="/products")

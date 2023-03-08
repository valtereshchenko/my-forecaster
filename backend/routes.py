from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from typing import List
from models import SalesModel, SalesUpdate, PyObjectId, PredictionModel, ModelModel, ModelOut
import pandas as pd
from greykite_model import predict


router = APIRouter()


@router.get("/", response_description="List all sales", response_model=List[SalesModel])
def list_sales(request: Request):
    sales = list(request.app.database["sales_new"].find(limit=100))

    return sales


# @router.get("/{id}", response_description="Get a single sale by id", response_model=SalesModel)
# def find_sales(id: str, request: Request) -> SalesModel:
#     sale = request.app.database.sales_new.find_one({'_id': PyObjectId(id)})
#     if sale is not None:
#         return sale

#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                         detail=f"Sale with ID {id} not found")

@router.get("/products", response_description="List all the products")
def get_products(request: Request):
    products = list(request.app.database.sales_new.find_one().keys())
    products = products[1:-1]

    if products is not None:
        return products
    else:
        return {"status_code": 400,
                "message": "Oops! No products were found."}


@router.get("/prediction/{product}/{time}", response_description="Get all sales by column name", response_model=List[PredictionModel])
def find_sales(product: str, time: int, request: Request) -> pd.DataFrame:
    some_product = []
    dates = []
    ids = []
    products = pd.DataFrame()
    for item in request.app.database.sales_new.find({}, {'saleDate': 1, product: 1}):
        some_product.append(item[product])
        dates.append(item['saleDate'])
        ids.append(item['_id'])
        d = {f'{product}': some_product, 'saleDate': dates, 'id': ids}
        df_dictionary = pd.DataFrame(data=d)
        products = df_dictionary.copy()

    prediction = predict(products, time, product)

    prediction_to_insert = prediction.to_dict(orient="records")

    new_prediction = request.app.database.predictions.insert_many(
        prediction_to_insert)

    created_prediction = list(request.app.database.predictions.find(
        {"_id": {'$in': new_prediction.inserted_ids}}
    ))

    if created_prediction is not None:
        return created_prediction  # the response is a list of objects

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Sale not found")


@router.post("/message/",
             response_description="Add Message",
             status_code=200, responses={200: {"description": "Message has been delivered successfully!"}, 400: {"decription": "Oooops, there has been an error!"}}
             )
def addMessage(request: Request, data: dict = Body(...)):
    data = jsonable_encoder(data)

    new_message = request.app.database.messages.insert_one(
        data)

    added_message = request.app.database.messages.find_one(
        {"_id": new_message.inserted_id}
    )
    if added_message is not None:
        return {"status_code": 200,
                "message": "A new message has been delivered successfully!"}
    else:
        return {"status_code": 400,
                "message": "Ooops! Something went wrong."}

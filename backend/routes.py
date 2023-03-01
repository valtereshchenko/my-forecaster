from fastapi import APIRouter, Body, Request, Response, HTTPException, status
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

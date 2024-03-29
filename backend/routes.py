from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import Response, JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List
from models import PredictionModel, ForecastsModel, PyObjectId, AnalysisModel, ChartModel, UpdateChartModel
import pandas as pd
from greykite_model import predict
from datetime import date
from data_processing.processing_pipeline import analyse_response


router = APIRouter()


@router.get("/forecasts", response_description="Get all saved forecasts", response_model=List[ForecastsModel])
def get_forecasts(request: Request):
    """Retrieves all the forecast charts saved by the user from the DB"""
    forecasts = list(request.app.database["saved_charts"].find())

    if forecasts is not None:
        return forecasts

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Forecasts not found")


@router.get("/prediction/{product}/{time}/{collection}/{id}", response_description="Get all sales by column name", response_model=List[PredictionModel])
def find_and_predict(product: str, time: int, collection: str, id: str, request: Request) -> pd.DataFrame:
    """
    Gets the data from the uploaded by the user file, by the id, 
    runs the forecast on the specified by the user product and for the specified forecast horizon
    """
    some_product = []
    dates = []
    products = pd.DataFrame()

    id = PyObjectId(id)
    data = request.app.database[f'{collection}'].find_one({'_id': id})

    for item in data['file']:
        some_product.append(item[product])
        dates.append(item['saleDate'])
        d = {f'{product}': some_product, 'saleDate': dates}
        df_dictionary = pd.DataFrame(data=d)
        products = df_dictionary.copy()

    # fix dataframe types
    products['saleDate'] = pd.to_datetime(products['saleDate'])
    products[f'{product}'] = pd.to_numeric(products[f'{product}'])

    prediction = predict(products, time, product)

    prediction_to_insert = prediction.to_dict(orient="records")

    if prediction_to_insert is not None:
        return prediction_to_insert  # the response is a list of objects

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Something went wrong! The forecast could not be made.")


@router.get('/explore/{collection}/{id}', response_description='The newly uploaded data was fetched successfully')
def get_uploaded_data(request: Request, id: str, collection: str):
    """
    Get the product names for the uploaded by the user file
    """

    id = PyObjectId(id)
    data = request.app.database[f'{collection}'].find_one(
        {'_id': id})

    products = list(data['file'][0].keys())
    products = products[1:-1]  # the last column is a date column

    if products is not None:
        return products
    else:
        return {"status_code": 400,
                "message": "Oops! No products were found."}


@ router.post("/prediction/save", response_description="Save selected forecast to the DB", response_model=ChartModel)
def save_forecast(request: Request, data: dict = Body(...)):
    """
    Receives the new forecast data as a JSON in a post request
    Saves the newly created forecast to the DB
    """
    new_data = request.app.database.saved_charts.insert_one(
        {"data": data, "name": data['name'], "date": date.today().strftime("%m/%d/%Y")})

    saved_prediction = list(request.app.database.saved_charts.find_one(
        {"_id": new_data.inserted_id}, {'_id': 0}
    ))

    if saved_prediction is not None:
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=saved_prediction)
        # return {"status_code": 200,
        #         "message": "The forecast have been saved successfully"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Prediction could not be saved!")


@ router.post("/message/",
              response_description="Add Message",
              status_code=200, responses={200: {"description": "Message has been delivered successfully!"}, 400: {"decription": "Oooops, there has been an error!"}}
              )
def add_message(request: Request, data: dict = Body(...)):
    """
    Saves the user message from the contact form to the DB
    """
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


@ router.post("/uploadfile", response_description="File uploaded", response_model=AnalysisModel)
def upload_file(request: Request, data: dict = Body(...)):
    """
    Uploads the file selected by the user to the DB uploaded_data colletion
    Runs the analysis and saves it to the 'analyzed_data' collection in the DB
    """

    data = jsonable_encoder(data)

    new_file = request.app.database.uploaded_data.insert_one(data)

    created_record = list(request.app.database.uploaded_data.find(
        {"_id": new_file.inserted_id}
    ))

    id = str(new_file.inserted_id)

    # run data anayze pipeline on the obtained df, insert the resulting analysis to the mongoDB and return the analysis to display to the user
    # df = pd.DataFrame([i for i in data['file']])
    # config = {
    #     'response_variable': data['target'],
    #     'temporal_variable': data['timeField'],
    #     'freq': data['frequency'],
    # }
    # data_analyzed = analyse_response(df, config) #runs quite slow so use the ready analysis for the demo

    data_analyzed = pd.read_csv(
        './data/data_analyzed.csv', index_col=0)

    analysis_to_insert = data_analyzed.to_dict(orient="records")

    new_analysis = request.app.database.analyzed_data.insert_one(
        {'analysis': analysis_to_insert})

    created_analysis = list(request.app.database.analyzed_data.find(
        {'_id': new_analysis.inserted_id}
    ))

    if (created_record is not None):
        return JSONResponse(status_code=status.HTTP_201_CREATED, content={
            "id": id,
            "analysis": analysis_to_insert
        })
    else:
        return {"status_code": 400,
                "message": "Ooops! Something went wrong."}


@router.put('prediction/{id}', response_description='Update a saved chart', response_model=ChartModel)
def update_chart(id: str, request: Request, chart: UpdateChartModel = Body(...)):
    """
    Receives the id of the document to update as well as the new data in the JSON body. 
    Iterate over all the items in the received dictionary and only add the items that have a value to our new document.
    If there are no fields left to update, looks for an existing record that matches the id and returns that unaltered.
    """

    chart = {k: v for k, v in chart.dict().items() if v is not None}

    if len(chart) >= 1:
        update_result = request.app.database.saved_charts.update_one({"_id": id}, {
                                                                     "$set": chart})
        updated_chart = request.app.database.saved_charts.find_one({
            "_id": id})
        if update_result.modified_count == 1:
            if updated_chart is not None:
                return updated_chart

    existing_chart = request.app.database.saved_charts.find_one({"_id": id})
    if existing_chart is not None:
        return existing_chart

    raise HTTPException(status_code=404, detail=f"Student {id} not found")


@ router.delete('/dashboard/delete', response_description="Chart deleted")
def delete_chart(request: Request, data=Body(...)):
    """
    Deletes the saved forecast chart from the DB
    """

    id = PyObjectId(data['_id'])

    delete_result = request.app.database.saved_charts.delete_one(
        {'_id': id})

    if delete_result.deleted_count == 1:
        return {"status_code": 200,
                "message": "The Chart has been deleted successfully!"}

    raise HTTPException(
        status_code=404, detail=f"Chart not found in the Database")

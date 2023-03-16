from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import Optional
from datetime import date
import numpy as np


class PyObjectId(ObjectId):
    # Custom Type for reading MongoDB IDs
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class ForecastsModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    data: dict
    name: str
    date: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "63f747bcb2ac35288903a1c1",
                "data": {"name": "Laptop Sales Forecasts", "forecast": []},
                "name": "Laptop Sales Forecasts",
                "date": "2023-01-01"
            }
        }


class PredictionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    saleDate: date = Field(...)
    actual: Optional[int] = Field(...)
    forecast: int = Field(...)
    forecast_lower: int = Field(...)
    forecast_upper: int = Field(...)

    # Custom validator
    @validator('actual', pre=True)
    def allow_none(cls, v):
        if v is None or np.isnan(v):
            return None
        else:
            return v

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "63f747bcb2ac35288903a1c1",
                "saleDate": '2020-01-01',
                "actual": "NaN",
                "forecast": "256.3",
                "forecast_lower": "256.3",
                "forecast_upper": "333",
            }
        }


class ChartModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    data: dict
    name: str
    date: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "63f747bcb2ac35288903a1c1",
                "data": {"name": "Laptop Sales Forecasts", "forecast": [], "sales": []},
                "name": "Laptop Sales Forecasts",
                "date": "2023-01-01"
            }
        }

from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional, Sequence
from datetime import datetime
import uuid


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


class ModelModel(BaseModel):
    _id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    pens: Optional[Sequence[float]]
    saleDate: Optional[Sequence[str]]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        orm_mode = True
        schema_extra = {
            "example": {
                "_id": "63f747bcb2ac35288903a1c1",
                "paper": "333",
                "saleDate": "2022-12-01"
            }}


class ModelOut(BaseModel):
    data: Optional[ModelModel]


class SalesModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    keyboards: float = Field(...)  # convert to int as these are unit sales
    laptop: float = Field(...)
    monitor: float = Field(...)
    notepad: float = Field(...)
    paper: float = Field(...)
    pens: float = Field(...)
    saleDate: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "63f747bcb2ac35288903a1c1",
                "keyboards": "333",
                "laptop": "256.3",
                "monitor": "333",
                "notepad": "256.3",
                "paper": "333",
                "pens": "256.3",
                "saleDate": "2022-12-1",
            }
        }


class SalesUpdate(BaseModel):
    keyboads: Optional[int]
    laptop: Optional[int]
    saleDate: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "keyboards": 343,
                "laptop": 343,
                "saleDate": "2022-12-01"
            }
        }


class PredictionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    saleDate: datetime = Field(...)
    actual: float = Field(...)
    forecast: float = Field(...)
    forecast_upper: float = Field(...)
    forecast_lower: float = Field(...)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "_id": "63f747bcb2ac35288903a1c1",
                "saleDate": '2020-01-01',
                "actual": "333",
                "forecast": "256.3",
                "forecast_upper": "333",
                "forecast_lower": "256.3",
            }
        }

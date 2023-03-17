from greykite.framework.templates.autogen.forecast_config import MetadataParam
from greykite.framework.templates.model_templates import ModelTemplateEnum
from greykite.framework.templates.autogen.forecast_config import ForecastConfig
from greykite.framework.templates.forecaster import Forecaster
import pandas as pd
import numpy as np


def predict(data: pd.DataFrame, forecast_horizon: int, product: str):
    # specify dataset information
    metadata = MetadataParam(
        time_col='saleDate',  # name of the time column
        value_col=product,  # name of the value column
        freq="D"  # "H" for hourly, "D" for daily, "W" for weekly, etc.
        # Any format accepted by `pandas.date_range`
    )
    forecaster = Forecaster()  # Creates forecasts and stores the result
    forecaster.load_forecast_result('./model/greykite_mock_data_model')

    result = forecaster.run_forecast_config(  # result is also stored as `forecaster.forecast_result`.
        df=data,
        config=ForecastConfig(
            model_template=ModelTemplateEnum.SILVERKITE.name,
            forecast_horizon=forecast_horizon,  # 42 forecasts 365 steps ahead
            coverage=0.95,         # 95% prediction intervals
            metadata_param=metadata
        )
    )
    forecast = result.forecast
    forecasted_data = forecast.df

    # to speed up and  plot only monthly data

    forecasted_data['saleDate'] = pd.to_datetime(forecasted_data['saleDate'])
    forecasted_data.set_index('saleDate', inplace=True)
    forecasted_data = forecasted_data.resample('MS').sum().reset_index()
    # to reproduce the line chart correctly we will need NaNs instead of zeros
    forecasted_data.replace(0, np.nan, inplace=True)

    print('forecasted', forecasted_data)
    return forecasted_data

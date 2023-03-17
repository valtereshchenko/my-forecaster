import numpy as np
import pandas as pd
from data_processing.data_analysis import TimeSeriesAnalysis

from data_processing.preprocessing import *


def analyse_response(data: pd.DataFrame, config: dict) -> pd.DataFrame:
    """
    This function loads previously cleaned data, adds seasonal dummies and
    performs data analysis, including: ABC, XYZ, Demand Type, Sales Classification,
    ts_features and DTW.

    Args:
           data (pd.DataFrame): A pandas dataframe
           config : Data Processing configurations
    Returns:
        (pd.DataFrame): A wide pandas dataframe with one line per each forecast_level (DFU) and its obtained stats.
    """
    data = data.fillna(0)
    data = fix_dataframe_types(
        data, config.response_variable, config.temporal_variable)
    data = data[data[config.temporal_variable] <= config.history_end_date]
    data = data.sort_values(by=config.temporal_variable, ascending=True)

    # creates the num_"date_col"
    seq_dates_df = data[[config.temporal_variable]
                        ].drop_duplicates().reset_index(drop=True)
    seq_dates_df = seq_dates_df.sort_values(
        by=[config.temporal_variable], ascending=False).reset_index(drop=True)
    seq_dates_df[f"num_{config.temporal_variable}"] = seq_dates_df.index

    merged_df_date_num = data.merge(seq_dates_df, on=config.temporal_variable)

    # adds seasonal dummies to the df
    data_with_dummies = adding_dummies(
        merged_df_date_num, config.freq, config.temporal_variable)

    result = TimeSeriesAnalysis(data_with_dummies, config=config)
    return result.time_series_descriptive_analysis(config=config)

import pandas as pd
from typing import Optional


def fix_dataframe_types(
    df: pd.DataFrame, response_variable: str, temporal_variable: str, regressors: Optional[list] = None
) -> pd.DataFrame:
    """A function to change types in pandas to avoid kedro input read errors

    Args:
        df (pd.DataFrame): The dataframe of interest
        response_variable (str): Response column name
        temporal_variable (str): Column name with date-time strings

    Returns:
        pd.DataFrame: modified types
    """
    # To fix target problem
    if response_variable in df.columns:
        df[response_variable] = df[response_variable].astype(float)
    # To fix date problem
    df[temporal_variable] = df[temporal_variable].apply(pd.to_datetime)
    if regressors:
        df[regressors] = df[regressors].astype(float)
    return df


def adding_dummies(df: pd.DataFrame, freq, time_col):
    """Create dummy features.
    Dummy features are created for the Elastic Net implementation (used in the analyse_response module).
    Dummy features make up the X Matrix of regressors (seasonal dummies of 0 and 1)
    Against which regularized Linear Regression is applied: y = b*X, where X e.g.
    For monthly data it consists of 11 columns.

    Args:
        df (pd.DataFrame): input data with time series data
        freq (pd.freq): string with
        time_col ([type]): [description]

    Returns:
        [type]: [description]
    """
    if freq.startswith("W"):
        df["week_num"] = df[time_col].dt.isocalendar().week
        df["week_num"] = df["week_num"].apply(lambda x: min(x, 52))
        df = pd.get_dummies(df, columns=["week_num"],
                            drop_first=True, prefix="seas_w", prefix_sep="")
    else:
        df["month_num"] = df[time_col].dt.month
        df = pd.get_dummies(df, columns=["month_num"],
                            drop_first=True, prefix="seas_m", prefix_sep="")

    return df

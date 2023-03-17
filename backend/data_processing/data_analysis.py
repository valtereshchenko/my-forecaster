from functools import reduce

import numpy as np
import pandas as pd
import regex as re
from tsfeatures import entropy, hurst, lumpiness, nonlinearity, poly, sparsity, stability, tsfeatures


def calculate_demand_type(row):
    """Calculate demand type
    Categories include "smooth", "low", "intermittent", "erratic",
    "lumpy"

    - smooth & erratic have regular demand, whereas intermittent and lumpy have irregular demand
    - smooth & intermittent have low demand variability, whereas erratic and lumpy have high variability
    - classification is based 4-quadrant diagram [Syntetos and Boylan, 2005]

    More info:

    Args:
        row ([type]): row object

    Returns:
        str: demand type of time series
    """

    if row["varDemMagn"] == "low":
        return "smooth" if row["ADIcat"] == "low" else "intermittent"
    else:
        return "erratic" if row["ADIcat"] == "low" else "lumpy"


class TimeSeriesAnalysis:
    """TimeSeriesAnalysis class which controls how
    time series data (currently only the response) within a pd.DataFrame gets analysed.

    More info in :doc:: `time_series_analysis_guide </forecasting_engine/time_series_analysis_guide>`

    """

    def __init__(self, df: pd.DataFrame, config) -> None:
        self.df = df
        # self.time_data_monthly = time_data_monthly

        self.input_freq = config.freq
        self.date_col = config.temporal_variable
        self.target_col = config.response_variable
        self.forecast_level_col = df['_id']

        # self.time_series_freq = dict_config["analysis_freq"]

        self.frequency = 52 if "W" in self.input_freq else 12
        #  set the variables for different forecast levels: Country, Brand etc.
        self.forecast_level_groupby_abc = [self.forecast_level_col]
        if len(config.forecast_level) > 1:
            self.group_by_abc = config.forecast_level
            self.forecast_level_groupby_abc = self.group_by_abc + \
                self.forecast_level_groupby_abc
        else:
            self.group_by_abc = []

        # setting grouping parameters for the class
        self.forecast_level_target_cols = self.forecast_level_groupby_abc + \
            [self.target_col]  # agg cols + target

        self.date_forecast_level_cols = [
            self.date_col] + self.forecast_level_groupby_abc
        self.sort_df_columns = self.forecast_level_groupby_abc + \
            [self.date_col]

        self.total_groupby_columns = self.date_forecast_level_cols.copy() + \
            [self.target_col]
        # agg cols + target without forecast_level
        self.sortcols = self.group_by_abc + [self.target_col]

        self.aClass = config.aClass
        self.bClass = config.bClass
        self.periods_abc = np.ceil(config.abc_years * self.frequency)

        self.xClass = config.xClass
        self.yClass = config.yClass

        self.periods_npi = np.ceil(config.periods_npi * self.frequency)
        self.periods_obs = np.ceil(config.periods_obs * self.frequency)

        self.n_dec = config.n_dec if config.n_dec is not None else 2
        self.n_clusters = config.n_clusters
        self.num_threads = config.num_threads
        self.verbose_mode = 1 if config.verbose_mode else 0

    def general_analysis(self):
        """
        Calculates the number of observations per forecast_level and the min and max dates

        Args:
            pdf: a pd.DataFrame with forecast_level, date_col and target_col
        Returns:
            grouped pdf: a data frame with forecast_level's first and last dates, total number of obs. and the sum of target.
        """

        count_num_obs = (
            self.df.groupby(self.forecast_level_groupby_abc)[
                self.date_col].agg(["min", "max", "count"]).reset_index()
        )
        count_num_obs = count_num_obs.rename(
            columns={"min": "start_date", "max": "end_date", "count": "n_obs"})

        #  get the target column sum per forecast_level
        groupdf = self.df.groupby(by=self.forecast_level_groupby_abc)[
            self.target_col].sum().reset_index()
        groupdf = groupdf.rename(
            columns={self.target_col: self.target_col + "_historical"})

        return count_num_obs.merge(groupdf, on=self.forecast_level_groupby_abc, how="outer")

    def abc_analysis(self):
        """
        Sorts forecast_levels into 3 classes A,B,C based on previously defined A and B class split on target_col

        Args:
            pdf: a pd.DataFrame with forecast_level and target_col
            aClass, bClass: floats for definition of A and B classes
        Returns:
            grouped pdf: a data frame with forecast_levels sorted into 3 classes, pd.DataFrame
        """

        analysis_df = self.df[self.df[f"num_{self.date_col}"]
                              < self.periods_abc]

        # calculate sum of target_col grouped by forecast_level_groupby_abc, sort, cumulative sum, cumulative percentage
        tot_vol_group_by_abc = (
            analysis_df[self.forecast_level_target_cols].groupby(
                by=self.forecast_level_groupby_abc).sum().reset_index()
        )
        tot_vol_group_by_abc = tot_vol_group_by_abc.sort_values(
            by=self.sortcols, ascending=False)

        if len(self.group_by_abc) != 0:
            tot_vol_group_by_abc["CumVol"] = tot_vol_group_by_abc.groupby(by=self.group_by_abc)[
                self.target_col
            ].cumsum()
            tot_vol_group_by_abc["CumVolPer"] = tot_vol_group_by_abc["CumVol"] / tot_vol_group_by_abc.groupby(
                by=self.group_by_abc
            )[self.target_col].transform("sum")
        else:  # if group_by_abc is None
            tot_vol_group_by_abc["CumVol"] = tot_vol_group_by_abc[self.target_col].cumsum(
            )
            tot_vol_group_by_abc["CumVolPer"] = (
                tot_vol_group_by_abc["CumVol"] /
                tot_vol_group_by_abc[self.target_col].sum()
            )

        tot_vol_group_by_abc = tot_vol_group_by_abc.sort_values(
            by=self.sortcols, ascending=False)

        # Shift the CumVolPer by one position
        if len(self.group_by_abc) != 0:
            tot_vol_group_by_abc["lag_CumVolPer"] = tot_vol_group_by_abc.groupby(by=self.group_by_abc)[
                "CumVolPer"
            ].shift(1)
        else:
            tot_vol_group_by_abc["lag_CumVolPer"] = tot_vol_group_by_abc["CumVolPer"].shift(
                1)

        # Replace generated Nones with zeros
        tot_vol_group_by_abc = tot_vol_group_by_abc.fillna(0)
        tot_vol_group_by_abc["abc"] = tot_vol_group_by_abc["lag_CumVolPer"].apply(
            lambda x: "A" if x <= self.aClass else "C" if x > self.bClass else "B"
        )

        tot_vol_group_by_abc = tot_vol_group_by_abc[self.forecast_level_groupby_abc + [
            "abc"] + [self.target_col]]
        tot_vol_group_by_abc = tot_vol_group_by_abc.rename(
            columns={self.target_col: self.target_col + "_abc"})

        return tot_vol_group_by_abc

    def life_cycle_class(self):
        """
        Sorts forecast_levels into 3 groups Obsolete, NPI, Mature based on previously defined npi and obs periods of time,

        Args:
            pdf: a pd.DataFrame with forecast_level, target_col and date_col
            periods_npi, periods_obs: floats for definition of NPI and Obsolete groups, depend on the data freq.
        Returns:
            grouped pdf: a data frame with forecast_levels sorted into 3 groups, pd.DataFrame
        """

        life_cycle_cols = self.forecast_level_groupby_abc + \
            ["num_" + self.date_col]  # select the necessary columns
        # check whether it is a NPI
        npi_df = (
            self.df[life_cycle_cols]
            .groupby(self.forecast_level_groupby_abc, as_index=False)["num_" + self.date_col]
            .max()
        )

        npi_df["NPI"] = npi_df[f"num_{self.date_col}"].apply(
            lambda x: "NPI" if x < self.periods_npi else "NO_NPI")

        # check whether it is Obsolete
        obs_df = (
            self.df[self.df[f"num_{self.date_col}"] <
                    self.periods_obs][self.forecast_level_target_cols]
            .groupby(self.forecast_level_groupby_abc, as_index=False)[self.target_col]
            .sum()
        )

        obs_df["OBS"] = obs_df[self.target_col].apply(
            lambda x: "NO_OBS" if x > 0 else "OBS")

        # merge and classify
        npi_new_cols = self.forecast_level_groupby_abc + ["NPI"]
        obs_new_cols = self.forecast_level_groupby_abc + ["OBS"]
        df_classes = npi_df[npi_new_cols].merge(
            obs_df[obs_new_cols], on=self.forecast_level_groupby_abc)

        df_classes["demand_life_cycle"] = df_classes.apply(
            lambda x: "NPI" if x["NPI"] == "NPI" else "Obsolete" if x["OBS"] == "OBS" else "Mature", axis=1
        )
        df_classes = df_classes.drop(columns=["NPI", "OBS"])

        return df_classes

    def xyz(self, row):
        """
        Labells every DFU with X,Y or Z.

        """
        xClass = self.xClass
        yClass = self.yClass

        if row["seasonal_strength"] > 0:
            if row["cov_seas_adj"] <= xClass:
                xyz_result = "X"
            elif row["cov_seas_adj"] <= yClass:
                xyz_result = "Y"
            else:
                xyz_result = "Z"
        elif row["cov"] <= xClass:
            xyz_result = "X"
        elif row["cov"] <= yClass:
            xyz_result = "Y"
        else:
            xyz_result = "Z"

        return xyz_result

    def stl_features_analysis(self):
        """
        Calculates lumpiness, stability, entropy, hurst and nonlinearity based on tsfeatures library
        check it at: https://github.com/Nixtla/tsfeatures

        Args:
            pdf: a pd.DataFrame with forecast_level, target_col and date_col
        Returns:
            grouped pdf: a grouped DataFrame with lumpiness, stability, entropy, hurst and nonlinearity per each forecast_level
        """

        panel0 = self.df[self.total_groupby_columns]

        panel0["unique_id"] = panel0[self.forecast_level_groupby_abc].agg(
            r"\(~)/".join, axis=1)  # create new id column

        panel = self.df[self.total_groupby_columns]
        panel["unique_id"] = panel[self.forecast_level_groupby_abc].agg(
            r"\(~)/".join, axis=1)  # create new id column

        panel = panel[["unique_id", self.date_col, self.target_col]]
        panel = panel.rename(
            columns={self.date_col: "ds", self.target_col: "y"})

        panel_analysis = tsfeatures(
            panel, freq=self.frequency, features=[
                lumpiness, stability, entropy, hurst, nonlinearity]
        )

        features_final = pd.merge(
            panel_analysis,
            panel0[self.forecast_level_groupby_abc + ["unique_id"]
                   ].drop_duplicates(subset=["unique_id"]),
            how="left",
            on="unique_id",
        )
        features_final = features_final.drop(columns=["unique_id"])

        return features_final

    def dem_type_analysis(self, xyz_group_analysis):
        """
        Classifies forecast_levels into 4 groups smooth, intermittent, erratic, lumpy based on Average Demand Intermittency
        and the CoV value from the XYZ analysis.

        Args:
            pdf: a pd.DataFrame with forecast_level, target_col, date_col and XYZ results
        Returns:
            grouped pdf: a grouped DataFrame with forecast_levels sorted into 4 demand-based classes.
        """

        sales_df = self.df[self.df[self.target_col] > 0]
        sales_df = sales_df.groupby(self.forecast_level_groupby_abc)[
            self.date_col].count().reset_index()
        sales_df = sales_df.rename(columns={self.date_col: "nonzero_periods"})

        hist_df = self.df.copy()
        hist_df = hist_df.groupby(self.forecast_level_groupby_abc)[
            self.date_col].count().reset_index()
        hist_df = hist_df.rename(columns={self.date_col: "total_periods"})

        adi_grouped = hist_df.merge(
            sales_df, on=self.forecast_level_groupby_abc, how="left")
        adi_grouped["nonzero_periods"] = adi_grouped["nonzero_periods"].fillna(
            0)

        adi_grouped["ADIvalue"] = adi_grouped["total_periods"] / \
            adi_grouped["nonzero_periods"]
        adi_grouped["ADIcat"] = adi_grouped["ADIvalue"].apply(
            lambda x: "high" if x > 1.32 else "low")

        dfmincov = xyz_group_analysis
        dfmincov["mincov"] = dfmincov[["cov"]].min(axis=1)
        dfmincov["var_cov"] = dfmincov["mincov"] ** 2
        dfmincov["varDemMagn"] = dfmincov["var_cov"].apply(
            lambda x: "high" if x > 0.49 else "low")

        merge_Cov_Adi = pd.merge(
            adi_grouped, dfmincov, how="outer", on=self.forecast_level_groupby_abc)

        merge_Cov_Adi["demand_type"] = merge_Cov_Adi.apply(
            lambda x: calculate_demand_type(x), axis=1)

        cov_adi_cols = self.forecast_level_groupby_abc + ["demand_type"]
        return merge_Cov_Adi[cov_adi_cols]

    def intermittency_value(self):
        """
        Calculates the intermittency value with the formula specified by the IBP team.

        Args:
            pdf: a pd.DataFrame with forecast_level, target_col, date_col
        Returns:
            grouped pdf: a grouped DataFrame with intermittency value per each forecast_level.
        """

        # discard all the records where sales = 0
        intermt_df = self.df[self.df[self.target_col] != 0]
        int_cols_volume = (
            self.forecast_level_groupby_abc +
            [self.target_col] + ["num_" + self.date_col]
        )  # select the cols
        SortColsint = self.forecast_level_groupby_abc + \
            [f"num_{self.date_col}"]

        # calculate sum of volume_col by forecast_level_groupby_abc, num_time and sort
        tot_vol_group_by_int = (
            intermt_df[int_cols_volume].groupby(
                by=SortColsint)[self.target_col].agg("sum").reset_index()
        )
        tot_vol_group_by_int = tot_vol_group_by_int.sort_values(
            by=SortColsint, ascending=True)

        # calculate the mean of intermittency value
        tot_vol_group_by_int["intermittency_v"] = tot_vol_group_by_int.groupby(by=self.forecast_level_groupby_abc)[
            f"num_{self.date_col}"
        ].diff()

        tot_vol_group_fin = tot_vol_group_by_int.dropna()
        tot_vol_group_fin = (
            tot_vol_group_fin.groupby(self.forecast_level_groupby_abc)[
                "intermittency_v"].mean().reset_index()
        )

        return tot_vol_group_fin

    def get_sparsity(self):
        """
        Calculated the sparcity value per DFU.

        """

        sparsity_df = (
            self.df[self.total_groupby_columns]
            .groupby(self.forecast_level_groupby_abc)[self.target_col]
            .aggregate(sparsity)
            .reset_index()
        )
        sparsity_df = sparsity_df.rename(columns={self.target_col: "sparsity"})
        sparsity_df["sparsity"] = sparsity_df["sparsity"].apply(
            lambda x: x["sparsity"])

        return sparsity_df

    def time_series_descriptive_analysis(self, config):
        """
        Creates a wide dataframe with time series analysis per DFU.

        """

        # getting the general analysis
        stats_df = self.general_analysis()

        #  run the abc analysis
        abc_analysis_df = self.abc_analysis()

        #  run life_cycle_class function
        life_cycle_df = self.life_cycle_class()

        #  run stl_func_analysis
        stl_analysis_df = self.stl_features_analysis()

        sparsity_df = self.get_sparsity()

        #  demand type classification
        demand_type_analysis_df = self.dem_type_analysis(
            stl_analysis_df)
        intermittency_value_df = self.intermittency_value()

        #  merge all the outputs
        frames = [
            life_cycle_df,
            stats_df,
            abc_analysis_df,

            demand_type_analysis_df,
            intermittency_value_df,

            stl_analysis_df,
            sparsity_df,
        ]

        time_series_analysed = reduce(
            lambda left, right: pd.merge(
                left, right, on=self.forecast_level_groupby_abc, how="outer"), frames
        )
        time_series_analysed = time_series_analysed.sort_values(self.target_col + "_abc", ascending=False).round(
            self.n_dec
        )
        time_series_analysed = time_series_analysed[
            (
                (self.forecast_level_groupby_abc +
                 [f"{self.target_col}_historical"])
                + [
                    "demand_life_cycle",
                    f"{self.target_col}_abc",
                    "abc",
                    "start_date",
                    "n_obs",
                    "demand_type",
                    "cov",
                    "xyz",
                    "sparsity",
                    "intermittency_v",
                    "lumpiness",
                    "stability",
                    "entropy",
                    "hurst",
                    "nonlinearity",
                    "trend_slope",
                    "trend_curvature",
                    "seasonal_strength",
                    "spikiness",
                ]
            )
        ]

        print("Your data has been analyzed.")

        return time_series_analysed

import { Box, TextField, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import LineChart from "../components/LineChart";

export default function Dashboard() {
  const [forecasts, setForecasts] = useState([0]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchForecasts = async () => {
      setFetching(true);
      const response = await fetch("/forecasts/");
      const data = await response.json();

      setForecasts(data);
      setFetching(false);
    };
    fetchForecasts();
  }, []);

  return (
    <>
      <Box sx={{ height: "65px" }}></Box>
      {forecasts.length === 0 ? (
        <Box>Loading your forecasts...</Box>
      ) : (
        <Grid
          //   xs={12}
          //   sm={12}
          //   md={8}
          //   lg={8}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {forecasts.map((obj: any) => (
            <>
              <Grid item xs={12}>
                <Box key={obj.name}> {obj.name}</Box>

                {obj.data ? (
                  <Box height="450px" width="450" m="-20px 0 0 0">
                    <LineChart
                      key={obj["_id"]}
                      actual={obj.data.sales}
                      prediction={obj.data.forecast}
                    ></LineChart>
                  </Box>
                ) : (
                  <Box>Loading...</Box>
                )}
              </Grid>
            </>
          ))}
        </Grid>
      )}
    </>
  );
}

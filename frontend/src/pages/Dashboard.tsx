import { Box, TextField } from "@mui/material";
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
        forecasts.map((obj: any) => (
          <>
            <Box>{obj.name}</Box>
            <Box>{obj.date}</Box>

            {obj.data ? (
              <LineChart
                actual={obj.data.sales}
                prediction={obj.data.forecast}
              ></LineChart>
            ) : (
              <Box>Loading...</Box>
            )}
          </>
        ))
      )}
    </>
  );
}

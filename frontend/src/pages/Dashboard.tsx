import { Box, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import Chart from "../components/Chart";

export default function Dashboard() {
  const [forecasts, setForecasts] = useState([0]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchForecasts = async () => {
      setFetching(true);
      const response = await fetch("/forecasts/");
      const data = await response.json();
      console.log("data", data);

      setForecasts(data);
      setFetching(false);
    };
    fetchForecasts();
  }, []);

  console.log("forecasts1", forecasts);

  return (
    <>
      <Box sx={{ height: "65px" }}></Box>
      {forecasts.length === 0 ? (
        <Box>Loading your forecasts...</Box>
      ) : (
        forecasts.map((obj: any) => (
          <>
            <Box>{obj.name}</Box>
            {/* <TextField>{obj.forecast}</TextField> */}
            <Chart actual={obj.sales} prediction={obj.forecast}></Chart>
          </>
        ))
      )}
    </>
  );
}

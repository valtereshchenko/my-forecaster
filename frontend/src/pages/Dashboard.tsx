import { Box, TextField, Grid, Typography, Divider } from "@mui/material";
import React, { useState, useEffect } from "react";
import LineChart from "../components/LineChart";
import FileUploader from "../components/FileUploader";
import "../components/styles/Dashboard.css";

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

  //styling
  const fileUploader = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "10px 15px",
    fontFamily: "'Inter', sans-serif",
    color: "rgb(45, 55, 72)",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  };

  const upperContainer = {
    width: "100%",
    backgroundColor: "#F7F9FC",
    marginTop: "-10px",
  };

  return (
    <>
      <Box sx={{ height: "60px" }}></Box>
      {forecasts.length === 0 ? (
        <Box>Loading your forecasts...</Box>
      ) : (
        <Box className="container-box">
          <Box sx={upperContainer}>
            <Box sx={fileUploader}>
              <Box className="title">
                <h2 className="h2-title">DASHBOARD</h2>
                <p className="h5-paraph">Welcome to your dashboard!</p>
              </Box>
              <Box sx={{ display: "block" }}>
                <p>Upload your data here:</p>
                <FileUploader />
              </Box>
            </Box>
          </Box>
          {/* <Divider></Divider> */}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {forecasts.map((obj: any, index: number) => (
              <>
                <Grid
                  key={`${index}-grid`}
                  item
                  xs={12}
                  className="grid-item-graph"
                >
                  <Box key={`${index}-namebox`} className="graph-item-title">
                    Title: {obj.name}
                  </Box>
                  <Box className="graph-item-title">Date saved: {obj.date}</Box>

                  {obj.data ? (
                    <Box
                      className="graph-item"
                      key={`${obj.name}+${index}`}
                      m="-20px 0 0 0"
                    >
                      <LineChart
                        key={`${index}-chart`}
                        actual={obj.data.sales}
                        prediction={obj.data.forecast}
                      ></LineChart>
                    </Box>
                  ) : (
                    <Box key="loading">Loading...</Box>
                  )}
                </Grid>
              </>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}

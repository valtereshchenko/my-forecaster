import React, { useState } from "react";
import Forecast from "../components/Forecast";
import { Button, Box, Paper, Typography } from "@mui/material";

export default function QuickStart() {
  const [data, setData] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [forecasting, setForecasting] = useState(false);

  const updateFetching = (value: boolean) => {
    setFetching(value);
  };

  const updateActive = (value: boolean) => {
    setForecasting(value);
  };

  //styling
  const paraphs = {
    fontFamily: "Inter, sans-serif",
    padding: "5px",
    color: "#727B80",
    fontWeight: "500",
  };

  return (
    <>
      <Box sx={{ height: "65px" }} />
      <Forecast
        fetching={fetching}
        handleFetch={updateFetching}
        data={data}
        setData={setData}
        url="/explore/sales/64130c362f636973dab212d9"
        dataId="64130c362f636973dab212d9"
        collection="sales"
        handleActive={updateActive}
      />
      {!forecasting ? (
        <>
          <Paper
            sx={{
              fontFamily: "Inter, sans-serif",
              width: "550px",
              margin: "-25px 0 0 15px",
              padding: "10px",
            }}
            elevation={1}
          >
            <Typography sx={paraphs}>
              MFE is designed to graphically share with you the future forecast
              of the selected variable/product for the selected time period.
            </Typography>
            <Typography sx={paraphs}>
              We have pre-loaded some data for you, so go ahead and select a
              product and the "forecast horizon" - timeframe you want MFE to
              produce the forecast for, hit the FORECAST button and see the
              magic happen.
            </Typography>
          </Paper>

          <Button
            href="/fileuploader/"
            sx={{
              backgroundColor: "white",
              color: "#77209D",
              padding: "8px 22px",
              margin: "15px",
              border: "1px solid #77209D",
              "&:hover": { backgroundColor: "#F7F9FC" },
            }}
          >
            Try MFE with my own data!
          </Button>

          <Box className="default-dashboard-msg">
            <h2>The future of your business is just a few clicks away...</h2>
          </Box>
        </>
      ) : (
        <Button
          href="/fileuploader/"
          sx={{
            backgroundColor: "white",
            color: "#77209D",
            padding: "8px 22px",
            margin: "15px",
            border: "1px solid #77209D",
            "&:hover": { backgroundColor: "#F7F9FC" },
          }}
        >
          Try MFE with my own data!
        </Button>
      )}
    </>
  );
}

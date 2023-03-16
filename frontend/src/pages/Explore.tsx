import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import SubHeader from "../components/SubHeader";
import Forecast from "../components/Forecast";
import { Box, Divider } from "@mui/material";

export default function Explore() {
  const [data, setData] = useState(false);
  const [id, setId] = useState("");
  const [fetching, setFetching] = useState(false);

  //styling
  const fileUploader = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "10px 0 0 0",
    fontFamily: "'Inter', sans-serif",
    color: "rgb(45, 55, 72)",
    alignItems: "center",
    backgroundColor: "white", //"#F7F9FC",
  };

  const updateFetching = (value: boolean) => {
    setFetching(value);
  };

  return (
    <Box sx={{ backgroundColor: "#F7F9FC", width: "100%" }}>
      <Box sx={{ height: "65px" }} />
      <SubHeader
        title="Explore & Forecast"
        subTitle="Upload your own data and start forecasting!"
      />
      <Box sx={fileUploader}>
        <Box sx={{ display: "block", margin: "0 15px" }}>
          <p>Upload your data here:</p>
          <FileUploader data={data} setData={setData} id={id} setId={setId} />
        </Box>
      </Box>
      <Divider />
      {!data ? (
        <Box
          sx={{
            backgroundColor: "white",
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={require("./explore.png")}
            alt="bulding puzzle"
            style={{ opacity: "0.7" }}
          ></img>
        </Box>
      ) : (
        <Forecast
          fetching={fetching}
          handleFetch={updateFetching}
          data={data}
          setData={setData}
          url={`/explore/${id}`}
          dataId={id}
          collection="uploaded_data"
        />
      )}
    </Box>
  );
}

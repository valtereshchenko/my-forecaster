import React from "react";
import { Typography, Divider, Box } from "@mui/material";

type SubHeaderProps = {
  title: string;
  subTitle: string;
};

export default function SubHeader({ title, subTitle }: SubHeaderProps) {
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

  return (
    <Box sx={fileUploader}>
      <Box className="title">
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: "700",
            fontSize: "2.5rem",
            opacity: "0.6",
          }}
        >
          {title}
        </Typography>
        <Divider
          variant="middle"
          sx={{ width: "100%", margin: "0 0 10px 0" }}
        />
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: "400",
            fontSize: "1.5rem",
            color: "#8C43AF",
            fontStyle: "italic",
            marginTon: "7px",
          }}
        >
          {subTitle}
        </Typography>
      </Box>
    </Box>
  );
}

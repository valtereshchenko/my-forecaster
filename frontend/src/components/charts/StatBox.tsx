import { Box, Typography } from "@mui/material";
import { ReactElement } from "react";
import ProgressCircle from "./ProgressCircle";

type StatBoxProps = {
  title: string;
  subtitle: string;
  progress: number;
  increase: string;
  icon: ReactElement;
};

const StatBox = ({
  title,
  subtitle,
  progress,
  increase,
  icon,
}: StatBoxProps) => {
  //styles

  const titles = {
    fontFamily: "Inter, sans-serif",
    fontSize: "1,2rem",
  };

  return (
    <Box width="100%" m="0 30px" p="12px 0">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            fontWeight="bold"
            sx={{ color: "#303851", fontSize: "1.5rem" }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography
          sx={{
            color: "#BA90CE",
            fontFamily: "Inter, sans-serif",
            fontSize: "1.2rem",
          }}
        >
          {subtitle}
        </Typography>
        <Typography variant="h5" fontStyle="italic" sx={{ color: "#77209D" }}>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;

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
  return (
    <Box width="100%" m="0 30px" p="12px 0">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#e0e0e0" }}>
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: "#4cceac" }}>
          {subtitle}
        </Typography>
        <Typography variant="h5" fontStyle="italic" sx={{ color: "#3da58a" }}>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;

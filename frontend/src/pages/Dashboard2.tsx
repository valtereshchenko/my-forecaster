import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import mockTransactions from "../components/data/mockTransactions.json";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../components/LineChart";
import GeographyChart from "../components/GeographyChart";
import BarChart from "../components/BarChart";
import StatBox from "../components/StatBox";
import ProgressCircle from "../components/ProgressCircle";
import "../components/styles/Dashboard.css";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));

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
    // marginTop: "-10px",
  };

  return (
    <Box sx={upperContainer}>
      {/* HEADER */}
      <Box
        display={smScreen ? "flex" : "block"}
        flexDirection={smScreen ? "row" : "column"}
        justifyContent={smScreen ? "space-between" : "start"}
        alignItems={smScreen ? "center" : "start"}
        m="70px 0 0 0"
      >
        <Box sx={upperContainer}>
          <Box sx={fileUploader}>
            <Box className="title">
              <h2 className="h2-title">DASHBOARD</h2>
              <p className="h5-paraph">Welcome to your dashboard!</p>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            sx={{
              backgroundColor: "white",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatBox
              title="12,361"
              subtitle="Emails Sent"
              progress={0.75}
              increase="+14%"
              icon={<EmailIcon sx={{ color: "#3da58a", fontSize: "26px" }} />}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatBox
              title="431,225"
              subtitle="Sales Obtained"
              progress={0.5}
              increase="+21%"
              icon={
                <PointOfSaleIcon sx={{ color: "#3da58a", fontSize: "26px" }} />
              }
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatBox
              title="32,441"
              subtitle="New Clients"
              progress={0.3}
              increase="+5%"
              icon={
                <PersonAddIcon sx={{ color: "#3da58a", fontSize: "26px" }} />
              }
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            sx={{
              width: "100%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatBox
              title="1,325,134"
              subtitle="Traffic Received"
              progress={0.8}
              increase="+43%"
              icon={<TrafficIcon sx={{ color: "#3da58a", fontSize: "26px" }} />}
            />
          </Box>
        </Grid>
        <Box
          width="100%"
          sx={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            margin: "10px 0",
            display: "flex",
            backgroundColor: "#F7F9FC",
          }}
        >
          <h2 className="h2-title">Sales Overview</h2>
        </Box>
        <Grid xs={12} sm={12} md={4}>
          <Box sx={{ backgroundColor: "white", p: "30px" }}>
            <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size={125} />
              <Typography variant="h5" color="#4cceac" sx={{ mt: "15px" }}>
                $48,352 revenue generated
              </Typography>
              <Typography>
                Includes extra misc expenditures and costs
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={4}>
          <Box sx={{ backgroundColor: "white" }}>
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ padding: "30px 30px 0 30px" }}
            >
              Sales per Product
            </Typography>
            <Box height="250px">
              <BarChart isDashboard={true} />
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} sm={12} md={4}>
          <Box sx={{ backgroundColor: "white", padding: "32px" }}>
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ marginBottom: "15px" }}
            >
              Geography Based Sales
            </Typography>
            <Box height="200px">
              <GeographyChart isDashboard={true} />
            </Box>
          </Box>
        </Grid>
        <Box>Saved Forecasts</Box>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {forecasts.length === 0 ? (
            <Box>Loading your forecasts...</Box>
          ) : (
            forecasts.map((obj: any, index: number) =>
              obj.data ? (
                <Grid xs={12} sm={12} md={6} className="graph-item">
                  <Box sx={{ backgroundColor: "white", height: "450px" }}>
                    <Box
                      mt="25px"
                      p="0 30px"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <h2 className="h2-title">{obj.name}</h2>
                      </Box>
                      <Box>
                        <IconButton>
                          <DownloadOutlinedIcon
                            sx={{ fontSize: "26px", color: "#4cceac" }}
                          />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box
                      className="graph-item"
                      m="-20px 0 0 0"
                      key={`${obj.name}+${index}`}
                    >
                      <LineChart
                        key={`${index}-chart`}
                        actual={obj.data.sales}
                        prediction={obj.data.forecast}
                      />
                    </Box>
                  </Box>
                </Grid>
              ) : (
                <Box key="loading">Loading...</Box>
              )
            )
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

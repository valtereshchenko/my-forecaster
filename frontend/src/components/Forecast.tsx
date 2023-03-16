import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Autocomplete,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import Chart from "./Chart";

type ForecastProps = {
  fetching: boolean;
  handleFetch: any;
  url: string;
  data: boolean;
  setData: Dispatch<SetStateAction<boolean>>;
  collection: string;
  dataId: string;
};

export default function Forecast({
  fetching,
  handleFetch,
  url,
  data,
  setData,
  collection,
  dataId,
}: ForecastProps) {
  const [products, setProducts] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState("");
  const [time, setTime] = useState("");
  const [prediction, setPrediction] = useState([{ data: [] }]);
  const [actual, setActual] = useState([{ data: [] }]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      handleFetch(true);
      console.log("URL", url);
      const response = await fetch(`${url}`);
      const products = await response.json();

      setProducts(products);
      handleFetch(false);
      setData(true);
    };
    fetchProducts();
  }, [url, handleFetch, setData]);

  async function handlePredict() {
    setLoading(true);
    console.log("collection", collection);
    const response = await fetch(
      `/prediction/${product}/${time}/${collection}/${dataId}`
    );

    //TODO throw an error when no prediction is returned
    const data = await response.json();

    let resForecast: any = [{ id: "forecast", data: [] }];
    data.forEach((element: { saleDate: any; forecast: any; _id: any }) => {
      resForecast.forEach((object: any) => {
        object.data.push({ x: element.saleDate, y: element.forecast });
      });
    });

    let resActual: any = [{ id: "actual", data: [] }];
    data.forEach((element: { saleDate: any; actual: any }) => {
      resActual.forEach((object: any) => {
        object.data.push({ x: element.saleDate, y: element.actual });
      });
    });

    setActual(resActual);
    setPrediction(resForecast);
    setLoading(false);

    return prediction;
  }

  function saveChart() {
    // save the current prediction and pass it to the Dashboard page
    setOpen(false);

    let forecast = prediction[0].data;
    let sales = actual[0].data;

    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, forecast, sales }),
    };

    fetch("/prediction/save/", requestOption)
      .then((response) => {
        if (response.status === 200) {
          navigate("/dashboard/", { replace: true });
        }
        return response.json();
      })
      .then((data) => {
        if (data.status_code === 404) console.log(data.detail);
      });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <p className="loader-text">
            Your forecast is being processed. It might take a minute...
          </p>
        </div>
      ) : (
        <>
          <Box sx={{ display: "flex", margin: "15px 0 0 15px" }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Inter", sans-serif',
                padding: "5px",
                color: "#303851",
              }}
            >
              Get Forecasting!
            </Typography>
            <Avatar
              alt="click"
              sx={{ marginLeft: "10px", backgroundColor: "#F2EBF6" }}
            >
              <img alt="click" src={require("./click.jpg")}></img>
            </Avatar>
          </Box>
          {fetching ? (
            <TextField sx={{ width: "200px", margin: "10px" }} value="..." />
          ) : (
            <Autocomplete
              disablePortal
              id="products"
              options={products}
              sx={{ width: "200px", display: "inline-flex" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product"
                  sx={{ margin: "10px" }}
                />
              )}
              onChange={(event, value: any) => setProduct(value)}
            />
          )}
          <FormControl sx={{ width: "200px", margin: "10px" }}>
            <InputLabel id="time">Forecast Horizon</InputLabel>
            <Select
              labelId="timeLabel"
              id="timeId"
              value={time}
              label="Forecast Horizon"
              onChange={(e) => setTime(e.target.value)}
            >
              <MenuItem value={30} sx={{ fontFamily: "Inter" }}>
                thirty days
              </MenuItem>
              <MenuItem value={60} sx={{ fontFamily: "Inter" }}>
                sixty days
              </MenuItem>
              <MenuItem value={90} sx={{ fontFamily: "Inter" }}>
                ninety days
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handlePredict}
            sx={{
              backgroundColor: "#7B1EA2",
              color: "white",
              padding: "8px 22px",
              margin: "15px 10px",
              "&:hover": { backgroundColor: "#4A148C" },
            }}
          >
            Forecast
          </Button>
          <Box sx={{ height: "60px" }} />
          {Object.keys(prediction[0]).length > 1 &&
          Object.keys(actual[0]).length > 1 ? (
            <Box sx={{ backgroundColor: "white" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0 -30px 0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    padding: "10px",
                    fontStyle: "italic",
                    fontWeight: "200",
                  }}
                >
                  {product} sales forecast
                </Typography>
              </Box>
              <Chart actual={actual} prediction={prediction}></Chart>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={handleClickOpen}
                  sx={{
                    backgroundColor: "#7B1EA2",
                    color: "white",
                    padding: "8px 22px",
                    marginBottom: "15px",
                    "&:hover": { backgroundColor: "#4A148C" },
                  }}
                >
                  Save to Dashboard
                </Button>
              </Box>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add to Dashboard</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To add the current forecast to your dashboard, please enter
                    a graph name here.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Chart Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setName(event.target.value);
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={saveChart}>Save</Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : (
            <Box sx={{ backgroundColor: "white" }} />
          )}
        </>
      )}
    </>
  );
}

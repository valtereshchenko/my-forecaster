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
  handleActive?: (value: boolean) => void;
};

type ActualType = {
  data: { x: string; y: number }[] | [];
  id: string;
}[];

type PredictionType = {
  data: { x: string; y: number }[] | [];
  id: string;
}[];

export default function Forecast({
  fetching,
  handleFetch,
  url,
  data,
  setData,
  collection,
  dataId,
  handleActive,
}: ForecastProps) {
  const [products, setProducts] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState("");
  const [time, setTime] = useState("");
  const [prediction, setPrediction] = useState<PredictionType>([]);
  const [actual, setActual] = useState<ActualType>([]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [predictError, setPredictError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      handleFetch(true);

      const response = await fetch(`${url}`);
      const products = await response.json();

      setProducts(products);
      handleFetch(false);
      setData(true);
    };
    try {
      fetchProducts();
    } catch (e) {
      console.log(e);
    }
  }, [url, handleFetch, setData]);

  async function handlePredict() {
    setLoading(true);

    if (handleActive) handleActive(true);

    const response = await fetch(
      `/prediction/${product}/${time}/${collection}/${dataId}`
    );

    try {
      if (response.status === 200) {
        const data = await response.json();

        //TODO move this part to the backend
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
      } else {
        setLoading(false);
        console.log(response);
        setPredictError(true);
      }
    } catch (error) {
      console.log(error);
    }
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
        if (response.status === 201) {
          navigate("/dashboard/", { replace: true });
        } else if (response.status === 404) {
          // oh no! we could not save the chart! Let's let user know
          console.log(response);
          setErrorOpen(true);
        }
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        // oh no! we could not save the chart! Let's let user know
        setErrorOpen(true);
      });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseError = () => {
    setErrorOpen(false);
  };

  const handleClosePredictError = () => {
    setPredictError(false);
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
          <Dialog open={predictError} onClose={handleClosePredictError}>
            <DialogContent>
              <DialogContentText>
                Ooops! Something went wrong! Please try to run your forecast
                again later.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button
                sx={{ color: "#7B1FA2" }}
                onClick={handleClosePredictError}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ height: "60px" }} />
          {typeof prediction[0] === "object" &&
          Object.keys(prediction[0])?.length > 1 &&
          Object.keys(actual[0])?.length > 1 ? (
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
              <Dialog open={errorOpen} onClose={handleCloseError}>
                <DialogContent>
                  <DialogContentText>
                    Sorry, your forecast could not be saved. Please try again
                    later.
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                  <Button sx={{ color: "#7B1FA2" }} onClick={handleCloseError}>
                    OK
                  </Button>
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

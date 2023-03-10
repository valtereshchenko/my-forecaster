import React, { useState, useEffect } from "react";
import Chart from "../components/Chart";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// const ProducContext = React.createContext({
//   producs: [],
//   fetchProducts: () => {},
// });

export default function QuickStart() {
  const [products, setProducts] = useState([0]);
  const [fetching, setFetching] = useState(true);
  const [product, setProduct] = useState("");
  const [time, setTime] = useState("");
  const [prediction, setPrediction] = useState([{ data: [] }]);
  const [actual, setActual] = useState([{ data: [] }]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setFetching(true);
      const response = await fetch("/products/");
      const products = await response.json();

      setProducts(products);
      setFetching(false);
    };
    fetchProducts();
  }, []);

  async function handlePredict() {
    setLoading(true);
    const response = await fetch(`/prediction/${product}/${time}`);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <>
      {loading ? (
        <>
          <div className="loader-container">
            <p className="loader-text">
              Your forecast is being processed. It might take a minute...
            </p>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: "100%", height: "80px" }}></div>
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
          {Object.keys(prediction[0]).length > 1 &&
          Object.keys(actual[0]).length > 1 ? (
            <>
              <Chart actual={actual} prediction={prediction}></Chart>
              <Button
                onClick={handleClickOpen}
                sx={{
                  backgroundColor: "#7B1EA2",
                  color: "white",
                  padding: "8px 22px",
                  margin: "15px 10px",
                  "&:hover": { backgroundColor: "#4A148C" },
                }}
              >
                Save to Dashboard
              </Button>
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
            </>
          ) : (
            <>
              <p style={{ marginLeft: "15px" }}>
                Select a product and the time frame you want to forecast its
                sales for.
              </p>
              <Box className="default-dashboard-msg">
                <h2>
                  The future of your business is just a few clicks away...
                </h2>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}

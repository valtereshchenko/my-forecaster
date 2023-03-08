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
} from "@mui/material";

// const ProducContext = React.createContext({
//   producs: [],
//   fetchProducts: () => {},
// });

export default function Dashboard() {
  const [products, setProducts] = useState([0]);
  const [fetching, setFetching] = useState(true);
  const [product, setProduct] = useState("");
  const [time, setTime] = useState("");
  const [prediction, setPrediction] = useState([{}]);
  const [actual, setActual] = useState([{}]);
  const [loading, setLoading] = useState(false);

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
    const data = await response.json();

    let resForecast: any = [{ id: "forecast", data: [] }];
    data.forEach((element: { saleDate: any; forecast: any }) => {
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
          {Object.keys(prediction[0]).length > 0 &&
          Object.keys(actual[0]).length > 0 ? (
            <Chart actual={actual} prediction={prediction}></Chart>
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

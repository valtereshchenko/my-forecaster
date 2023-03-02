import React, { useState } from "react";
import Chart from "../components/Chart";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

// const ProducContext = React.createContext({
//   producs: [],
//   fetchProducts: () => {},
// });

export default function Dashboard() {
  const [product, setProduct] = useState("");
  const [time, setTime] = useState("");
  const [prediction, setPrediction] = useState([{}]);
  const [actual, setActual] = useState([{}]);
  const [loading, setLoading] = useState(false);

  //TODO use useEffect to fetch all the products from the DB and add them to the list
  // const fetchTodos = async () => {
  //     const response = await fetch("http://localhost:8000/products")
  //     const products = await response.json()
  //     setProducts(products.data)
  //   }
  // }

  async function handlePredict() {
    setLoading(true);
    const response = await fetch(`/products/prediction/${product}/${time}`);
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
        <div className="loader-container">
          {/* <div className="spinner"></div> */}
        </div>
      ) : (
        <>
          <FormControl
            sx={{ width: "200px", margin: "5px", border: "#7B1EA2" }}
          >
            <InputLabel id="product">Product</InputLabel>
            <Select
              labelId="productLabel"
              id="productId"
              value={product}
              label="Product"
              onChange={(e) => setProduct(e.target.value)}
            >
              <MenuItem value={"laptop"}>Laptop</MenuItem>
              <MenuItem value={"paper"}>Paper</MenuItem>
              <MenuItem value={"keyboards"}>Keyboards</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: "200px", margin: "5px" }}>
            <InputLabel id="time">Time</InputLabel>
            <Select
              labelId="timeLabel"
              id="timeId"
              value={time}
              label="Time"
              onChange={(e) => setTime(e.target.value)}
            >
              <MenuItem value={30}>Thirty Days</MenuItem>
              <MenuItem value={60}>Sixty Days</MenuItem>
              <MenuItem value={90}>Ninety Days</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handlePredict}
            sx={{
              backgroundColor: "#7B1EA2",
              color: "white",
              padding: "8px 22px",
              margin: "12px 5px",
              "&:hover": { backgroundColor: "#4A148C" },
            }}
          >
            Predict
          </Button>
          {Object.keys(prediction[0]).length > 0 &&
          Object.keys(actual[0]).length > 0 ? (
            <Chart actual={actual} prediction={prediction}></Chart>
          ) : (
            <p>Select a product and a time frame</p>
          )}
        </>
      )}
    </>
  );
}

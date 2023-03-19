import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./styles/Search.css";

export default function Search() {
  const [results, setResults] = useState([]);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    event.preventDefault();
    setResults([]);

    const target = event.target as HTMLInputElement;

    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ searchQuery: target.value }),
    };
    fetch(`/search`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // setLoading(false);
        setResults(data);
        console.log(results);
      })
      .catch((event) => {
        console.log(event);
      });
  };

  console.log(results);

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={results}
        sx={{ width: 300 }}
        onInputChange={handleChange}
        renderInput={(params) => {
          return <TextField {...params} label="My Forecast" />;
        }}
      />
    </>
  );
}

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./styles/Search.css";

export default function Search() {
  const [results, setResults] = useState([]);

  const handleChange = (e: any) => {
    e.preventDefault();
    setResults([]);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ searchQuery: e.target.value }),
    };
    fetch(`/search`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // setLoading(false);
        setResults(data);
        console.log(results);
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
          return <TextField {...params} label="My Movie" />;
        }}
      />
    </>
  );
}

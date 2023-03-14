import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import Papa from "papaparse";

export default function FileUploader() {
  const [file, setFile] = useState([]);
  const [open, setOpen] = useState(false);
  const [timeField, setTimefield] = useState("");
  const [target, setTarget] = useState("");
  const [frequency, setFrequency] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState({
    name: "",
    ABC: "",
    Cov: "",
    "Demand Type": "",
    "Life Cycle Class": "",
    XYZ: "",
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleChange = (e: any) => {
    //shoud be :React.ChangeEvent<HTMLInputElement> type

    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        // Parsed Data Response in array format
        setFile(results.data);
      },
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    setOpen(false);

    async function fetchData() {
      if (file) {
        console.log("file 0", file[0]);

        const requestOptions = {
          method: "POST",
          url: "/uploadfile",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({
            file,
            timeField,
            target,
            frequency,
            fileName,
          }),
        };

        await axios(requestOptions)
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              setShowAnalysis(true);
              setAnalysis(response.data.analysis[0]);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    fetchData();
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <Box sx={{ flexDirection: "flex-row" }}>
            <input
              className="file-input"
              type={"file"}
              id={"csvFileInput"}
              accept={".csv"}
              onChange={handleChange}
            />
            <Button
              onClick={handleClickOpen}
              sx={{
                backgroundColor: "#7B1EA2",
                color: "white",
                padding: "5px 15px",
                margin: "15px 10px",
                fontSize: "0.75rem",
                "&:hover": { backgroundColor: "#4A148C" },
              }}
            >
              Import csv
            </Button>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Upload you data</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please let us know about following variable names in your file
                before the uploading:
              </DialogContentText>
              <TextField
                required
                autoFocus
                margin="dense"
                id="name"
                label="The taget variable name (what would you like to frecast)"
                type="text"
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setTarget(event.target.value);
                }}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="time"
                label="The date / timestemp variable name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setTimefield(event.target.value);
                }}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="fileFreq"
                label="What is the frequency of the time stamps in your data? (Daily, weekly or monthly)"
                type="text"
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFrequency(event.target.value);
                }}
              />
              <TextField
                required
                autoFocus
                margin="dense"
                id="fileName"
                label="The name for your file"
                type="text"
                fullWidth
                variant="standard"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFileName(event.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={(e) => handleSubmit(e)}>Save</Button>
            </DialogActions>
          </Dialog>
          {showAnalysis ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Product Name</TableCell>
                    <TableCell align="right">ABC</TableCell>
                    <TableCell align="right">XYZ</TableCell>
                    <TableCell align="right">CoV</TableCell>
                    <TableCell align="right">Demand Type</TableCell>
                    <TableCell align="right">Life Cycle Class</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell align="right">{analysis.name}</TableCell>
                  <TableCell align="right">{analysis.ABC}</TableCell>
                  <TableCell align="right">{analysis.XYZ}</TableCell>
                  <TableCell align="right">{analysis.Cov}</TableCell>
                  <TableCell align="right">{analysis["Demand Type"]}</TableCell>
                  <TableCell align="right">
                    {analysis["Life Cycle Class"]}
                  </TableCell>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No data uploaded yet.</p>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

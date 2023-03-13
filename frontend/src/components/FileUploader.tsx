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
} from "@mui/material";
import axios from "axios";
import Papa from "papaparse";

export default function FileUploader() {
  const [file, setFile] = useState([]);
  const [open, setOpen] = useState(false);
  const [timeField, setTimefield] = useState("");
  const [target, setTarget] = useState("");
  const [fileName, setFileName] = useState("");

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
        console.log("FILE", file);
        console.log("file 0", file[0]);

        const requestOptions = {
          method: "POST",
          url: "/uploadfile/",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({
            file: file,
            date_col: timeField,
            target: target,
            name: fileName,
          }),
        };

        await axios(requestOptions)
          .then((response) => {
            console.log(response);
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
                label="The date variable name"
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
        </Grid>
      </Grid>
    </Box>
  );
}

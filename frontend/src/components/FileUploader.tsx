import React, { useState, SetStateAction, Dispatch } from "react";
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
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";
import Papa from "papaparse";

type FileUploaderProps = {
  data: boolean;
  setData: Dispatch<SetStateAction<boolean>>;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
};

export default function FileUploader({
  data,
  setData,
  id,
  setId,
}: FileUploaderProps) {
  const [file, setFile] = useState([]);
  const [open, setOpen] = useState(false);
  const [timeField, setTimefield] = useState("");
  const [target, setTarget] = useState("");
  const [frequency, setFrequency] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState([
    {
      name: "",
      ABC: "",
      Cov: "",
      "Demand Type": "",
      "Life Cycle Class": "",
      XYZ: "",
    },
  ]);
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
            if (response.status === 200) {
              setShowAnalysis(true);
              setAnalysis(response.data.analysis);
              setData(true);
              setId(response.data.id);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    fetchData();
  }

  //stylinhg

  const pStyle = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "0.9rem",
    margin: "5px",
  };

  const tableCell = {
    fontFamily: '"Inter", sans-serif',
  };

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
                label="The taget variable name (what would you like to forecast)"
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
                label="The date / timestamp variable name"
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
                label="What is the frequency of the timestamps in your data? (Daily, weekly or monthly)"
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
            <Box sx={{ display: "flex" }}>
              <TableContainer
                component={Paper}
                elevation={8}
                sx={{
                  flexBasis: "50%",
                  margin: "15px 0",
                }}
              >
                <Table sx={{ minWidth: 550 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableCell} align="right">
                        Product Name
                      </TableCell>
                      <TableCell sx={tableCell} align="right">
                        ABC
                      </TableCell>
                      <TableCell sx={tableCell} align="right">
                        XYZ
                      </TableCell>
                      <TableCell sx={tableCell} align="right">
                        CoV
                      </TableCell>
                      <TableCell sx={tableCell} align="right">
                        Demand Type
                      </TableCell>
                      <TableCell sx={tableCell} align="right">
                        Life Cycle Class
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analysis.map((obj) => (
                      <TableRow key={`${obj.name}-row`}>
                        <TableCell
                          sx={tableCell}
                          align="right"
                          key={`${obj.name}-name`}
                        >
                          {obj.name}
                        </TableCell>
                        <TableCell
                          sx={tableCell}
                          align="right"
                          key={`${obj.name}-abc`}
                        >
                          {obj.ABC}
                        </TableCell>
                        <TableCell
                          sx={tableCell}
                          align="right"
                          key={`${obj.name}-xyz`}
                        >
                          {obj.XYZ}
                        </TableCell>
                        <TableCell
                          sx={tableCell}
                          align="right"
                          key={`${obj.name}-cov`}
                        >
                          {parseFloat(obj.Cov).toFixed(3)}
                        </TableCell>
                        <TableCell
                          sx={tableCell}
                          align="right"
                          key={`${obj.name}-dmt`}
                        >
                          {obj["Demand Type"]}
                        </TableCell>
                        <TableCell align="right" key={`${obj.name}-lcc`}>
                          {obj["Life Cycle Class"]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Paper
                sx={{
                  flexBasis: "50%",
                  margin: "0 0 15px 15px",
                  padding: "15px",
                }}
              >
                <Typography sx={pStyle} textAlign="center">
                  Based on the provided stats (on the left) you should be able
                  to get some quick insights about your target
                  variable/variables and thier forecastability.
                </Typography>
                <Divider />
                <Typography sx={pStyle}>
                  <Typography
                    component={"span"}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    ABC
                  </Typography>
                  : volume-based classification where the top 5% of products are
                  classified as A (account for 40% of volume), the following 15%
                  are classified as B and the bottom 80% of products - as C.
                </Typography>
                <Typography sx={pStyle}>
                  <Typography
                    component={"span"}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    XYZ
                  </Typography>
                  : demand-based classification. X items have the lowest demand
                  variability. Y items have a moderate amount of demand
                  variability, usually because of a known factor. Z items have
                  the highest demand variability and are therefore the hardest
                  to forecast.
                </Typography>
                <Typography sx={pStyle}>
                  <Typography
                    component={"span"}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    CoV
                  </Typography>
                  : Coeficient of Variance of the series.
                </Typography>
                <Typography sx={pStyle}>
                  <Typography
                    component={"span"}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    Demand Type
                  </Typography>
                  : Can assume one of the following values: smooth, erratic,
                  intermittent or lumpy. Smooth & erratic have regular demand,
                  whereas intermittent & lumpy have irregular demand (harder to
                  forecast). On the other hand, smooth & intermittent have low
                  demand variability, whereas erratic and lumpy have high
                  variability.
                </Typography>
                <Typography sx={pStyle}>
                  <Typography
                    component={"span"}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    Life Cycle Class
                  </Typography>
                  : product lifecycle classification, can assume the following
                  values: 'in scope', 'NPI' (new product introduction) or
                  'obsolete'. Product with NPI life cycle class will have no
                  demand for the first periods, while obsolete products will not
                  have any demand for the last periods, making both of the last
                  harder to forecast.
                </Typography>
              </Paper>
            </Box>
          ) : (
            <p>No data uploaded yet.</p>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

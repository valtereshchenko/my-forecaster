import React, { Component } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import "../components/styles/ErrorBoundry.css";

type ErrorBoundryProps = { children: any };
type ErrorBoundryState = { hasError: boolean };
export default class ErrorBoundry extends Component<
  ErrorBoundryProps,
  ErrorBoundryState
> {
  constructor(props: ErrorBoundryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box className="main-box">
          <Box className="outer-box">
            <Grid container spacing={6} className="grid-container">
              <Grid item xs={12} md={6} className="grid-item">
                <Box sx={{ height: "100%", withd: "100%" }}>
                  <img alt="error" src="/notfound.png"></img>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} className="grid-item">
                <Box sx={{ alignSelf: "center" }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      color: "#2D3749",
                      textAlign: "left",
                      fontWeight: "700",
                    }}
                  >
                    404
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      color: "#646E72",
                      textAlign: "left",
                    }}
                  >
                    Oops! Looks like you followed a bad link.
                  </Typography>
                  <Box className="button-box">
                    <Button
                      href="/"
                      sx={{
                        color: "white",
                        backgroundColor: "#7b1ea2",
                        fontFamily: '"Iter", sans-serif',
                        padding: "10px 15px",
                      }}
                    >
                      Back Home
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}

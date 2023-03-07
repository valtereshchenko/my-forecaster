import { Box, Grid } from "@mui/material";
import React from "react";
import "./styles/Footer.css";

export default function Footer() {
  return (
    <Box className="footer-main-box">
      <Grid container spacing={2} className="grid-container-footer">
        <Grid item className="grid-item-footer">
          <Box className="top-footer">
            <a href="/" title="MFE" className="logo">
              MFE
            </a>
            <Box className="footer-nav">
              <Box className="nav-item">
                <a className="nav-button" href="/about">
                  About
                </a>
              </Box>
              <Box className="nav-item">
                <a
                  className="nav-button"
                  href="https://github.com/valtereshchenko/my-forecaster"
                >
                  Documentation
                </a>
              </Box>
              <Box className="quick-start">
                <a href="/quickstart" className="quick-start-btn">
                  Quick Start
                </a>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item className="grid-item-footer"></Grid>
      </Grid>
    </Box>
  );
}

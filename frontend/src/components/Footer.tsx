import { Box, Grid } from "@mui/material";
import React from "react";
import "./styles/Footer.css";

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: "#F7F9FC" }}>
      <Box className="footer-main-box">
        <Grid container spacing={2} className="grid-container-footer">
          <Grid item className="grid-item-footer">
            <Box className="top-footer">
              <a href="/" title="MFE" className="logo">
                MFE
              </a>
              <Box className="footer-nav">
                <Box className="nav-item">
                  <a className="nav-button" href="/">
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
          <Grid item className="grid-item-footer">
            <h6 className="rights">
              © MFE. 2023, Barcelona. All rights reserved
            </h6>
            <p className="info">
              When you visit or interact with our MFE WebApp, we may use cookies
              for storing information to help provide you with a better, faster
              and safer experience and for marketing purposes.
            </p>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

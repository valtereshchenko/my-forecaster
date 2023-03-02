import React from "react";
import { Box, Container, Grid, Paper, Typography, Button } from "@mui/material";
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";
import Item from "@mui/material/Grid";

export default function Home() {
  return (
    <Box component="main">
      <Box className="css-1ybfalx"></Box>
      <Box className="css-0">
        <Box className="css-1gygmt4">
          <Box className="css-374h4r">
            <Grid container spacing={4} className="css-1tz8m30">
              <Item className="css-himpyl" item xs={12} md={6}>
                <Box component="div" aos-init aos-animate data-aos="fade-right">
                  <Box className="css-1qm1lh" sx={{ marginBottom: "16px" }}>
                    <Typography variant="h2" className="css-118ie5u">
                      Get insights into
                      <br />
                      your business'{" "}
                      <Typography variant="inherit" className="css-1tukh29">
                        success
                      </Typography>
                    </Typography>
                  </Box>
                  <Box className="css-i3pbo" sx={{ marginButtom: "24px" }}>
                    <Typography
                      component="p"
                      variant="h6"
                      className="css-ye5b4g"
                    >
                      MyForecaster will give you a quick glance at your
                      company's future. Plan your staffing, manage your
                      inventory and more wit the help of MyForecaster.
                    </Typography>
                  </Box>
                  <Box className="css-14hwaxf" sx={{ display: "flex" }}>
                    <Button
                      variant="contained"
                      size="large"
                      className="css-uwfjn8"
                      href="/start"
                    >
                      Quick Start{" "}
                      <TouchRipple className="css-w0pj6f"></TouchRipple>
                    </Button>
                    <Box className="css-np4b2e">
                      <Button
                        variant="outlined"
                        size="large"
                        className="css-1x0ry33"
                        href="/docs"
                      >
                        View documentation{" "}
                        <TouchRipple className="css-w0pj6f"></TouchRipple>
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Item>
              <Item className="css-iol86l" xs={12} md={6}>
                <Box className="css-1aez2l4">
                  <Box className="home-image">
                    <svg></svg>
                  </Box>
                </Box>
              </Item>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

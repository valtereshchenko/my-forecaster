import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import TouchRipple from "@mui/material/ButtonBase/TouchRipple";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

export default function Home() {
  const [res, setRes] = useState({ urls: { regular: "", small: "" } });

  const fetchRequest = async () => {
    const data = await fetch(
      "https://api.unsplash.com/search/photos?query=artificial intelligence&per_page=50&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k"
    );
    const dataJ = await data.json();
    const result = dataJ.results;

    let random_img = result[Math.floor(Math.random() * result.length)];
    setRes(random_img);
  };

  useEffect(() => {
    try {
      fetchRequest();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Box component="main">
      <Box className="css-1ybfalx"></Box>
      <Box className="css-0">
        <Box className="css-1gygmt4">
          <Box className="css-374h4r">
            <Grid container spacing={4} className="MuiGrid-item css-1tz8m30">
              <Grid className="css-himpyl" item xs={12} md={6}>
                <Box
                  component="div"
                  aos-init="true"
                  aos-animate="true"
                  data-aos="fade-right"
                >
                  <Box className="css-1qm1lh" sx={{ marginBottom: "16px" }}>
                    <span className="css-118ie5u">
                      Get insights into
                      <br />
                      your business'{" "}
                      <span className="css-1tukh29">success</span>
                    </span>
                  </Box>
                  <Box className="css-i3pbo">
                    <Typography
                      component="p"
                      variant="h6"
                      className="css-ye5b4g"
                    >
                      MyForecaster will give you a quick glance at your
                      company's future. Plan your staffing, manage your
                      inventory and more with the help of MyForecaster.
                    </Typography>
                  </Box>
                  <Box className="css-14hwaxf">
                    <a className="css-uwfjn8" href="/quickstart/">
                      Quick Start{" "}
                      <TouchRipple className="css-w0pj6f"></TouchRipple>
                    </a>
                    <Box className="css-np4b2e">
                      <a
                        className="css-1x0ry33"
                        href="https://github.com/valtereshchenko/my-forecaster"
                      >
                        View documentation{" "}
                        <TouchRipple className="css-w0pj6f"></TouchRipple>
                      </a>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} className="MuiGrid-item css-iol86l">
                <Box className="css-1aez2l4">
                  <Box>
                    <img
                      src={res.urls.regular}
                      alt="ai 📷"
                      className="home-image"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Testimonials />
      <Contact />
    </Box>
  );
}

import React from "react";
import "./styles/slick.css";
import "./styles/slick-theme.css";
import "./testimonials.json";
import "./styles/Testimonials.css";
import Slider from "react-slick";
import { Box, Avatar, Typography } from "@mui/material";
import testimonials from "./testimonials.json";

export default function Testimonials() {
  // styling
  const avatar = {
    height: "60px",
    width: "60px",
    backgroundColor: "rgba(123, 31, 162, 0.1)",
    color: "rgb(123, 31, 162)",
    marginBottom: "16px",
  };

  const avatarTitle = {
    margin: "0px 0px 0.35em",
    fontFamily: "Inter",
    fontSize: "1.25rem",
    lineHeight: "1.6",
    textAlign: "center",
    fontWeight: "500",
  };

  const settings = {
    className: "center",
    centerMode: false,
    infinite: false,
    centerPadding: "20px",
    slidesToShow: 3,
    speed: 500,
    dots: true,
  };
  return (
    <div className="container">
      <Slider {...settings}>
        {testimonials.map((obj) => (
          <div>
            <Box aos-init aos-animate data-aos="fade-up" className="css-uwwqev">
              <Box className="tstm-box">
                <Avatar variant="circular" sx={avatar}>
                  {obj.avatar}
                </Avatar>
                <Typography component="h6" gutterBottom sx={avatarTitle}>
                  {obj.title}
                </Typography>
                <Typography component="p" className="tstm-text">
                  {obj.text}
                </Typography>
              </Box>
            </Box>
          </div>
        ))}
      </Slider>
    </div>
  );
}

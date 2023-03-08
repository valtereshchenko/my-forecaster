import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Contact.css";
import { useLoader } from "./context/LoadContext";
import { Box, Grid, Button, Paper, TextField, Divider } from "@mui/material";

export default function Contact() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const generalContext = useLoader();

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lastname, email, message }),
    };
    fetch("/message/", requestOption)
      .then((response) => {
        if (response.status === 200) {
          alert("A new message has been delivered successfully!");
          setName("");
          setEmail("");
          setLastname("");
          setMessage("");
          navigate("/", { replace: true });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === "Error") generalContext?.setError(data.message);
      });
  };

  // function validateEmail(email: string) {
  //   let result = true;

  //   if (!email) {
  //     throw new Error("Email is Required");
  //   } else {
  //     const re =
  //       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //     result = re.test(String(email).toLowerCase());
  //     if (!result) {
  //       throw new Error("Please entere a valid email address.");
  //     } else {
  //       setEmail(email);
  //     }
  //   }
  //   return result;
  // }

  //styles
  const submitBtn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    outline: "0px",
    border: "0px",
    margin: "0px",
    paddingTop: "32px",
    paddingLeft: "32px",
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    appearance: "none",
    textDecoration: "none",
    textTransform: "none",
    fontFamily: " 'Inter', sans-serif",
    fontSize: "0.875rem",
    lineHeight: "1.75",
    minWidth: "64px",
    padding: "6px 16px",
    borderRadius: "4px",
    transition:
      "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(123, 31, 162)",
    boxShadow: "rgb(140 152 164 / 10%) 0px 12px 15px",
    width: "100%",
    height: "54px",
  };

  const formPaper = {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(45, 55, 72)",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    overflow: "hidden",
    width: "100%",
    borderRadius: "8px",
    boxShadow: "rgb(140 152 164 / 18%) 0px 10px 40px 10px",
    marginBottom: "32px",
    padding: "48px",
  };

  return (
    <Box className="contact-box">
      <Grid container spacing={8} className="contact-grid-conainer">
        <Grid item xs={12} md={6} className="left-grid-item">
          <Box>
            <Box>
              <p className="css-1c6kb7i">Contact Us</p>
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <h2 className="css-1u2kyl2">Get in touch</h2>
            </Box>
            <Box>
              <h6 className="css-p1xjzq">
                We'd love to talk about how we can help you.
              </h6>
            </Box>
            <Box className="mapbox">
              <iframe
                className="css-fac6ot"
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.064883143063!2d2.1958563152835424!3d41.39439727926347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a3d5fffc6021%3A0xac62228fe9ffa387!2sallWomen!5e0!3m2!1sen!2ses!4v1678120567999!5m2!1sen!2ses"
              ></iframe>
            </Box>
            <Grid container className="contact-info" spacing={2}>
              <Grid item className="css-rpybyc" xs={12} sm={6}>
                <p className="css-e099gd">Call us:</p>
                <h6 className="css-wse7us">+34 111 22 33</h6>
              </Grid>
              <Grid item className="css-rpybyc" xs={12} sm={6}>
                <p className="css-e099gd">Email us:</p>
                <h6 className="css-wse7us">goodpeople@gmail.com</h6>
              </Grid>
              <Grid item className="css-15j76c0" xs={12}>
                <p className="css-e099gd">Address:</p>
                <h6 className="css-wse7us">
                  Dr. Trueta 114, Barcelona, Spain, 08005
                </h6>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid container item xs={12} md={6} className="form-container">
          <Box>
            <Paper elevation={1} sx={formPaper}>
              <Box component="form" noValidate autoComplete="off">
                <Grid container spacing={4} className="form-grid-container">
                  <Grid item xs={12} sm={6} className="form-first-last">
                    <TextField
                      sx={{
                        display: "inline-flex",
                        flexDirection: "column",
                        position: "relative",
                        padding: " 0px",
                        margin: "0px",
                        border: " 0px",
                        verticalAlign: "top",
                        width: "100%",
                        height: "54px",
                      }}
                      id="name"
                      label="First Name"
                      value={name}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setName(event.target.value);
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} className="form-first-last">
                    <TextField
                      sx={{
                        display: "inline-flex",
                        flexDirection: "column",
                        position: "relative",
                        padding: " 0px",
                        margin: "0px",
                        border: " 0px",
                        verticalAlign: "top",
                        width: "100%",
                        height: "54px",
                      }}
                      id="lastname"
                      label="Last Name"
                      value={lastname}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setLastname(event.target.value);
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} className="css-15j76c0">
                    <TextField
                      sx={{
                        display: "inline-flex",
                        flexDirection: "column",
                        position: "relative",
                        padding: " 0px",
                        margin: "0px",
                        border: " 0px",
                        verticalAlign: "top",
                        width: "100%",
                        height: "54px",
                      }}
                      type="email"
                      id="email"
                      label="Email Address"
                      value={email}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setEmail(event.target.value);
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} className="css-15j76c0">
                    <TextField
                      className="form-textfield"
                      rows={6}
                      label="Message"
                      multiline
                      variant="outlined"
                      type="text"
                      id="maessage"
                      value={message}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setMessage(event.target.value);
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} className="css-15j76c0">
                    <Button sx={submitBtn} onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Grid>
                  <Grid item xs={12} className="css-15j76c0">
                    <Divider></Divider>
                  </Grid>
                  <Grid item xs={12} className="css-15j76c0">
                    <Box>
                      <p className="terms-conds">
                        By clicking on "submit" you agree to our Privacy Policy,
                        Data Policy and Cookie Policy
                      </p>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            <Box>
              <p className="getback">
                We'll get back to you in 1-2 business days.
              </p>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

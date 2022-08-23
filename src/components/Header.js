import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const user = localStorage.getItem("username");
  const isLogIn = user ? true : false;

  const loggingOut = () => {
    localStorage.clear();
    history.push("/");
    // window.location.reload();
  };

  return (
    <Box className="header">
      <Box
        className="header-title"
        onClick={() => {
          history.push("/");
        }}
      >
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {/* the children here signifies the textfield from line no. 163 ,that header returns as child in the product.js file
    this states that => this.props.children */}
      {children}

      {hasHiddenAuthButtons && (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      )}

      {isLogIn && (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => {
              history.push("/checkout");
            }}
          >
            <Avatar alt={user} src="avatar.png" />
            <div>{localStorage.getItem("username")}</div>
          </div>
          <Button variant="text" onClick={loggingOut}>
            logout
          </Button>
        </Stack>
      )}

      {!isLogIn && !hasHiddenAuthButtons && (
        <Stack direction="row">
          <Button
            onClick={() => {
              history.push("/login");
            }}
          >
            login
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              history.push("/register");
            }}
          >
            register
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;

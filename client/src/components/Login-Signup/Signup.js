import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, useMediaQuery } from "@material-ui/core";
import { register } from "../../store/utils/thunkCreators";

import SignupForm from "./SignupForm";
import LoginSignupHeader from "./LoginSignupHeader";
import LoginSignupPicture from "./LoginSignupPicture";

const Signup = ({ user, register }) => {
  const history = useHistory();
  const [formErrorMessage, setFormErrorMessage] = useState({});
  const md = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const sm = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container>
      {md && <LoginSignupPicture />}
      <Grid item xs={md ? 7 : 12}>
        <LoginSignupHeader sm={sm} history={history} toPath="login" text="Already have an account?" button="Login" />
        <SignupForm sm={sm} handleRegister={handleRegister} formErrorMessage={formErrorMessage} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

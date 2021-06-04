import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, useMediaQuery } from "@material-ui/core";
import { login } from "../../store/utils/thunkCreators";
import LoginSignupPicture from "./LoginSignupPicture";
import LoginSignupHeader from "./LoginSignupHeader";
import LoginForm from "./LoginForm";

const Login = ({ user, login }) => {
  const history = useHistory();
  const md = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const sm = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    await login({ email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container>
      {md && <LoginSignupPicture />}
      <Grid item xs={md ? 7 : 12}>
        <LoginSignupHeader
          sm={sm}
          history={history}
          toPath="register"
          text="Don't have an account?"
          button="Create account"
        />
        <LoginForm sm={sm} handleLogin={handleLogin} />
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
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

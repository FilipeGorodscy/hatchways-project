import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import image from "../../images/bg-img.png";
import bubble from "../../images/bubble.svg";

const styles = {
  background: {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    margin: "auto",
    height: "100vh",
  },
  shadow: {
    background: "linear-gradient(#3A8DFF, #86B9FF)",
    opacity: 0.85,
    width: "100%",
  },
  detail: {
    color: "white",
    fontSize: "2.3em",
    fontWeight: "bold",
    textAlign: "center",
    width: "fit-content",
  },
};

const LoginSignUpPicture = () => {
  return (
    <Grid item xs={5}>
      <Paper style={styles.background}>
        <Box style={styles.shadow}>
          <Grid container direction="row" alignContent="center" justify="center" style={{ minHeight: "100vh" }}>
            <Box mb="2em">
              <img src={bubble} alt="Bubble Icon" height="90" />
            </Box>
            <Box mx="4em" mb="8em" mt="1.5em">
              <Typography style={styles.detail}> Converse with anyone with any language</Typography>
            </Box>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

export default LoginSignUpPicture;

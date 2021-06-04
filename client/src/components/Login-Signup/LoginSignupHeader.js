import { Box, Button, Grid, Typography } from "@material-ui/core";
import React from "react";

const styles = {
  button: { color: "#3A8DFF", padding: 20, paddingLeft: 45, paddingRight: 45 },
  text: { color: "#B0B0B0", fontSize: "1.15em", fontWeight: 600 },
};

const LoginSignupHeader = ({ sm, history, text, button, toPath }) => {
  return (
    <Box mt={sm ? 2 : 5} mr={sm ? 5 : 0}>
      <Grid container direction="row" alignItems="baseline" justify={sm ? "flex-end" : "center"}>
        <Typography style={styles.text}>{text}</Typography>
        <Box boxShadow={2} ml={sm ? 5 : 0} borderRadius={5}>
          <Button style={styles.button} onClick={() => history.push(`/${toPath}`)}>
            {button}
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default LoginSignupHeader;

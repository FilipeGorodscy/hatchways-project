import {
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";

const LoginForm = ({ sm, handleLogin }) => {
  return (
    <Box mt={sm ? 15 : 2} mx={sm ? 15 : 2}>
      <form onSubmit={handleLogin}>
        <Grid style={{ minWidth: "fit-content" }}>
          <Box mb={5} fontSize={sm ? "h5.fontSize" : "h6.fontSize"} fontWeight={600} lineHeight={2} letterSpacing={1}>
            Welcome back!
          </Box>
          <Box mb={5}>
            <FormControl fullWidth margin="normal" required>
              <TextField aria-label="email" label="E-mail address" name="email" type="text" />
            </FormControl>
          </Box>

          <FormControl fullWidth margin="normal" required>
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              id="standard-adornment-password"
              label="Password"
              aria-label="password"
              type="password"
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <Button style={{ color: "#3A8DFF" }}>Forgot?</Button>
                </InputAdornment>
              }
            />
          </FormControl>

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              style={{
                background: "#3A8DFF",
                color: "white",
                padding: 20,
                paddingLeft: 80,
                paddingRight: 80,
                marginTop: 50,
              }}
            >
              <Typography style={{ fontWeight: "bold" }}>Login</Typography>
            </Button>
          </Box>
        </Grid>
      </form>
    </Box>
  );
};

export default LoginForm;

import { Box, Button, FormControl, FormHelperText, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";

const SignupForm = ({ sm, handleRegister, formErrorMessage }) => {
  return (
    <Box mt={sm ? 15 : 2} mx={sm ? 15 : 2}>
      <form onSubmit={handleRegister}>
        <Grid style={{ minWidth: "fit-content" }}>
          <Box mb={5} fontSize={sm ? "h5.fontSize" : "h6.fontSize"} fontWeight={600} lineHeight={2} letterSpacing={1}>
            Create an account.
          </Box>

          <Box mb={5}>
            <FormControl fullWidth margin="normal" required>
              <TextField aria-label="username" label="Username" name="username" type="text" />
            </FormControl>
          </Box>

          <Box mb={5}>
            <FormControl fullWidth margin="normal" required>
              <TextField aria-label="email" label="E-mail address" name="email" type="text" />
            </FormControl>
          </Box>

          <Box mb={5}>
            <FormControl fullWidth error={!!formErrorMessage.confirmPassword}>
              <TextField
                aria-label="password"
                label="Password"
                type="password"
                inputProps={{ minLength: 6 }}
                name="password"
                required
              />
              <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
            </FormControl>
          </Box>
          <Box mb={5}>
            <FormControl fullWidth error={!!formErrorMessage.confirmPassword}>
              <TextField
                label="Confirm Password"
                aria-label="confirm password"
                type="password"
                inputProps={{ minLength: 6 }}
                name="confirmPassword"
                required
              />
              <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
            </FormControl>
          </Box>

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
              <Typography style={{ fontWeight: "bold" }}>Create</Typography>
            </Button>
          </Box>
        </Grid>
      </form>
    </Box>
  );
};

export default SignupForm;

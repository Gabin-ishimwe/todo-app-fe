import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/schema";
import { gql, useMutation } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import { loginError, loginSuccess } from "../store/actionCreators/login";
import { useSelector } from "react-redux";
import { State } from "../store/reducers";
import { useNavigate } from "react-router-dom";

const LOGIN_QUERY = gql`
  mutation UserRegister($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      firstName
      lastName
      email
      token
    }
  }
`;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

type IFormInput = {
  email: string;
  password: string;
};

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginReducer = useSelector((state: State) => state.loginReducer);
  const actions = bindActionCreators({ loginError, loginSuccess }, dispatch);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("success");
  const [login, { loading }] = useMutation(LOGIN_QUERY, {
    onCompleted: (data) => {
      // redux action
      actions.loginSuccess(data);
      localStorage.setItem("auth", data.userLogin.token);
      navigate("/dashboard");
      // setType("success");
      // setOpen(true);
      // setMessage("User logged in successfully");
    },
    onError: (error) => {
      //
      actions.loginError(error);
      setType("error");
      setOpen(true);
      setMessage(error.message);
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    login({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={type as AlertColor | undefined}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...field}
                  {...(errors?.email && {
                    error: true,
                    helperText: errors.email.message,
                  })}
                  sx={{
                    mt: 2,
                  }}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...field}
                  {...(errors?.password && {
                    error: true,
                    helperText: errors.password.message,
                  })}
                  sx={{
                    mt: 2,
                  }}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../validation/schema";
import { gql, useMutation } from "@apollo/client";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { signUpError, signUpSuccess } from "../store/actionCreators/signup";
import { State } from "../store/reducers";

const SIGN_UP_QUERY = gql`
  mutation UserRegister(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    userRegister(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      firstName
      lastName
      email
      password
      token
    }
  }
`;

const theme = createTheme();

type IFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignUp() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("success");
  const dispatch = useDispatch();
  const signUpState = useSelector((state: State) => state.signUpReducer);
  const actions = bindActionCreators({ signUpError, signUpSuccess }, dispatch);
  const [userRegister, { loading }] = useMutation(SIGN_UP_QUERY, {
    onCompleted: (data) => {
      // redux action
      actions.signUpSuccess(data);
      setType("success");
      setOpen(true);
      setMessage("User registered successfully");
    },
    onError: (error) => {
      // redux action
      actions.signUpError(error);
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
    resolver: yupResolver(signInSchema),
  });
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data, errors);
    // if (errors) return;
    userRegister({
      variables: {
        firstName: data.firstName,
        lastName: data.lastName,
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      autoComplete="given-name"
                      required
                      fullWidth
                      label="First Name"
                      autoFocus
                      {...field}
                      {...(errors?.firstName && {
                        error: true,
                        helperText: errors.firstName.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      autoComplete="family-name"
                      required
                      fullWidth
                      label="Last name"
                      autoFocus
                      id="lastName"
                      {...field}
                      {...(errors?.lastName && {
                        error: true,
                        helperText: errors.lastName.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
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
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
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
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress sx={{ color: "white" }} />
              ) : (
                "Sign Up"
              )}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

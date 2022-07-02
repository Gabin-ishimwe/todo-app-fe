import * as React from "react";
import Title from "../components/title";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  Paper,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { bindActionCreators } from "redux";
import {
  createCategoryError,
  createCategorySuccess,
  retrieveCategoryError,
  retrieveCategorySuccess,
} from "../store/actionCreators/category";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { State } from "../store/reducers";
import { CategoryState, Category } from "../store/reducers/category.reducer";

const CATEGORIES = gql`
  query Query {
    categories {
      name
      id
      createdAt
      updatedAt
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation Mutation($name: String!) {
    addCategory(name: $name) {
      id
      createdAt
      name
      updatedAt
    }
  }
`;

// export interface Category {
//   id?: number;
//   name?: string;
// }
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

type IFormInput = {
  name: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const schema = yup.object({
  name: yup.string().required("Category name required"),
});
const Categories = () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(
    {
      createCategoryError,
      createCategorySuccess,
      retrieveCategoryError,
      retrieveCategorySuccess,
    },
    dispatch
  );
  const categoriesReducer: CategoryState = useSelector(
    (state: State) => state.categoryReducer
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const [name, setName] = React.useState<string>("");
  const [categoriesError, setCategoriesError] = React.useState<string>("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("success");
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(CATEGORIES, {
    onError: (error) => {
      actions.retrieveCategoryError(error);
      setType("error");
      setOpenAlert(true);
      setMessage(error.message);
    },
    onCompleted: (data) => {
      actions.retrieveCategorySuccess(data);
    },
  });
  const [addCategory, res] = useMutation(CREATE_CATEGORY, {
    onCompleted: (data) => {
      actions.createCategorySuccess(data.addCategory);
      setType("success");
      setOpenAlert(true);
      setMessage("Category added");
      setValue("name", "");
    },
    onError: (error) => {
      actions.createCategoryError(error);
      setType("error");
      setOpenAlert(true);
      setMessage(error.message);
    },
  });
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const add: SubmitHandler<IFormInput> = (data) => {
    addCategory({
      variables: {
        name: data.name,
      },
    });
  };
  return (
    <Box>
      <Title children="Categories" />
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={type as AlertColor | undefined}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ textTransform: "none", my: 2, fontSize: "16px" }}
        onClick={handleOpen}
      >
        Create category
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit(add)}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Category
          </Typography>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                variant="outlined"
                autoComplete="given-name"
                label="Name"
                autoFocus
                {...field}
                {...(errors?.name && {
                  error: true,
                  helperText: errors.name.message,
                })}
              />
            )}
          />
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: 55, mx: 2 }}
            type="submit"
          >
            {res.loading ? <CircularProgress sx={{ color: "white" }} /> : "Add"}
          </Button>
        </Box>
      </Modal>
      {loading ? (
        <CircularProgress sx={{ display: "block" }} />
      ) : (
        <List>
          <Grid container spacing={2}>
            {categoriesReducer.allCategories?.categories?.map(
              (category: Category) => (
                <Grid item md={3} key={category.id}>
                  <Paper elevation={3}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemText primary={category.name} />
                      </ListItemButton>
                    </ListItem>
                  </Paper>
                </Grid>
              )
            )}
          </Grid>
        </List>
      )}
    </Box>
  );
};

export default Categories;

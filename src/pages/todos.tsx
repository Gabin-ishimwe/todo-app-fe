/* eslint-disable react/jsx-no-undef */
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
  Snackbar,
} from "@mui/material";
import React, { useEffect } from "react";
import Title from "../components/title";
import AddIcon from "@mui/icons-material/Add";
import title from "../components/title";
import { Category, CategoryState } from "../store/reducers/category.reducer";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../validation/schema";
import DoneIcon from "@mui/icons-material/Done";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../store/reducers";
import { Todo, TodoState } from "../store/reducers/todo.reducer";
import {
  retrieveTodoError,
  retrieveTodoSuccess,
  createTodoError,
  createTodoSuccess,
  deleteTodoError,
  deleteTodoSuccess,
} from "../store/actionCreators/todo";
import {
  retrieveCategoryError,
  retrieveCategorySuccess,
} from "../store/actionCreators/category";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import AlertDialogSlide from "../components/dialog";
import UpdateModal from "../components/modal";

const TODOS_QUERY = gql`
  query Feed {
    feed {
      tasks {
        id
        title
        description
        isDone
        createdAt
        updatedAt
        category {
          name
          id
        }
        user {
          email
          lastName
          firstName
        }
      }
      count
    }
  }
`;

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

const CREATE_TODO = gql`
  mutation Mutation($categoryId: Int!, $title: String!, $description: String!) {
    createTask(
      categoryId: $categoryId
      title: $title
      description: $description
    ) {
      title
      id
      description
      isDone
      createdAt
      updatedAt
      category {
        id
        name
      }
      user {
        firstName
        lastName
        id
        email
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTask($deleteTaskId: Int!) {
    deleteTask(id: $deleteTaskId) {
      id
      title
      description
      isDone
    }
  }
`;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

export type IFormInput = {
  title: string;
  description: string;
  category: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Todos = () => {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("success");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [cardToDelete, setCardToDelete] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const [input, setInput] = React.useState<Todo>({
    id: 0,
    title: "",
    description: "",
    category: {
      id: 0,
      name: "",
    },
  });
  const closeModal = () => setOpenModal(false);
  const dispatch = useDispatch();
  const actions = bindActionCreators(
    {
      retrieveTodoError,
      retrieveTodoSuccess,
      retrieveCategoryError,
      retrieveCategorySuccess,
      createTodoError,
      createTodoSuccess,
      deleteTodoError,
      deleteTodoSuccess,
    },
    dispatch
  );
  const todoReducer: TodoState = useSelector(
    (state: State) => state.todosReducer
  );
  const categoryReducer: CategoryState = useSelector(
    (state: State) => state.categoryReducer
  );
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDialog = (id: number) => {
    setOpenDialog(true);
    setCardToDelete(id);
  };
  const closeDialog = () => {
    setOpenDialog(false);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      category: "",
    },
  });
  const { loading, error, data } = useQuery(TODOS_QUERY, {
    onCompleted: (data) => {
      actions.retrieveTodoSuccess(data.feed);
      console.log(data);
    },
    onError: (error) => {
      actions.retrieveTodoError(error);
      console.log(error);
    },
  });
  const [deleteTask, deleteTaskState] = useMutation(DELETE_TODO, {
    onCompleted: (data) => {
      console.log(data);
      actions.deleteTodoSuccess(data.deleteTask);
      setType("success");
      setOpenAlert(true);
      setMessage("Todo deleted");
    },
    onError: (error) => {
      console.log(error);
      actions.deleteTodoError(error);
      setType("error");
      setOpenAlert(true);
      setMessage(error.message);
    },
  });
  const [retrieveCategories] = useLazyQuery(CATEGORIES, {
    onCompleted: (data) => {
      actions.retrieveCategorySuccess(data);
    },
    onError: (error) => {
      actions.retrieveCategoryError(error);
      setType("error");
      setOpenAlert(true);
      setMessage(error.message);
    },
  });
  const [createTodo, todoState] = useMutation(CREATE_TODO, {
    onCompleted: (data) => {
      console.log(data);
      actions.createTodoSuccess(data.createTask);
      setType("success");
      setOpenAlert(true);
      setMessage("Todo created");
    },
    onError: (error) => {
      console.log(error);
      actions.createTodoError(error);
      setType("error");
      setOpenAlert(true);
      setMessage(error.message);
    },
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data, errors);
    await createTodo({
      variables: {
        title: data.title,
        description: data.description,
        categoryId: parseInt(data.category),
      },
    });
    setValue("title", "");
    setValue("description", "");
    setValue("category", "");
    setOpen(false);
  };
  useEffect(() => {
    retrieveCategories();
  }, []);
  return (
    <Box>
      <Title children={"Todos"} />
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={() => setOpenAlert(false)}
          severity={type as AlertColor | undefined}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          textTransform: "none",
          my: 2,
          fontSize: "16px",
        }}
        onClick={handleOpen}
      >
        Add Todo
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Todo
          </Typography>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                variant="outlined"
                autoComplete="given-name"
                required
                fullWidth
                label="Title"
                autoFocus
                {...field}
                {...(errors?.title && {
                  error: true,
                  helperText: errors.title.message,
                })}
                sx={{
                  mt: 3,
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                autoComplete="family-name"
                required
                fullWidth
                label="Description"
                autoFocus
                id="lastName"
                {...field}
                {...(errors?.description && {
                  error: true,
                  helperText: errors.description.message,
                })}
                sx={{
                  mt: 3,
                }}
              />
            )}
          />

          <FormControl
            {...(errors.category && { error: true })}
            sx={{
              mt: 3,
            }}
            fullWidth
          >
            <InputLabel id="demo-simple-select-error-label">
              Category
            </InputLabel>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  {...field}
                >
                  {categoryReducer.allCategories?.categories.map(
                    (category: Category, index: number) => (
                      <MenuItem value={`${category.id}`} key={index}>
                        {category.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              )}
            />
            {errors.category && (
              <FormHelperText>{errors.category.message}</FormHelperText>
            )}
          </FormControl>
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: 55, fontSize: 18, my: 3 }}
            type="submit"
            fullWidth
          >
            {todoState.loading ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              "Add"
            )}
          </Button>
        </Box>
      </Modal>
      {loading ? (
        <CircularProgress sx={{ display: "block" }} />
      ) : (
        <Grid container spacing={3}>
          {todoReducer.allTodos?.tasks.map((task: Todo, index: number) => (
            <Grid item md={3} key={index}>
              <Card sx={{ maxWidth: "100%" }}>
                <CardContent>
                  <Title children={task.title} />
                  <Typography>{task.description}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="add to favorites">
                    <DoneIcon color="primary" />
                  </IconButton>
                  <IconButton
                    aria-label="share"
                    onClick={() => {
                      setInput(task);
                      setOpenModal(true);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    aria-label="share"
                    onClick={() => handleOpenDialog(task.id as number)}
                  >
                    <DeleteIcon color="primary" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <AlertDialogSlide
        dialog={openDialog}
        closeDialog={closeDialog}
        action={async () => {
          await deleteTask({
            variables: {
              deleteTaskId: cardToDelete,
            },
          });
          setOpenDialog(false);
        }}
      />
      <UpdateModal input={input} openModal={openModal} onClose={closeModal} />
    </Box>
  );
};

export default Todos;

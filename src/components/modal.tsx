import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Modal,
  Snackbar,
} from "@mui/material";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Todo } from "../store/reducers/todo.reducer";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFormInput } from "../pages/todos";
import { Category, CategoryState } from "../store/reducers/category.reducer";
import { categorySchema } from "../validation/schema";
import { useSelector } from "react-redux";
import { State } from "../store/reducers";

const UPDATE_TASK = gql`
  mutation Mutation($updateTaskId: Int!, $title: String, $description: String) {
    updateTask(id: $updateTaskId, title: $title, description: $description) {
      id
      title
      description
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
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
  input: Todo;
  openModal: boolean;
  onClose: () => void;
};

const UpdateModal = ({ input, openModal, onClose }: Props) => {
  const categoryReducer: CategoryState = useSelector(
    (state: State) => state.categoryReducer
  );
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
  const [openAlert, setOpenAlert] = React.useState(false);
  const [categoriesError, setCategoriesError] = React.useState<string>("");
  const [openAlertSucess, setOpenAlertSucess] = React.useState(false);
  const [updateTask, updateTaskState] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data, errors);
    updateTask({
      variables: {
        updateTaskId: input.id,
        title: data.title,
        description: data.description,
      },
    });
  };
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
    setOpenAlertSucess(false);
  };
  React.useEffect(() => {
    setValue("title", input.title as string);
    setValue("description", input.description as string);
    setValue("category", `${input.category.id}`);
  }, [input, setValue]);
  return (
    <Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {categoriesError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openAlertSucess}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {categoriesError}
        </Alert>
      </Snackbar>
      <Modal
        open={openModal}
        onClose={onClose}
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
            {updateTaskState.loading ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              "Add"
            )}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateModal;

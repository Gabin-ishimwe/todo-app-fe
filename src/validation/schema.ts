import * as yup from "yup";

export const signInSchema = yup.object({
  firstName: yup.string().required("First name required"),
  lastName: yup.string().required("Last name required"),
  email: yup.string().email().required("Email required"),
  password: yup
    .string()
    .required("Password required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
});

export const loginSchema = yup.object({
  email: yup.string().required("Email required"),
  password: yup
    .string()
    .required("Password required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
});

export const categorySchema = yup.object({
  title: yup.string().required("Title required"),
  description: yup.string().required("Description required"),
  category: yup.string().required("Category required"),
});

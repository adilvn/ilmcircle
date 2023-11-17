import * as Yup from "yup";

export const SignupScheme = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter your email"),
    confirm_email: Yup.string()
        .email("Please enter a valid email address")
        .oneOf([Yup.ref("email"), null], "Emails must match")
        .required("Please enter your confirm email"),
});

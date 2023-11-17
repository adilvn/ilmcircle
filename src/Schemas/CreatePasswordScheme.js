import * as Yup from "yup";

export const CreatePasswordScheme = Yup.object({
    password: Yup.string()
        .min(8, "At least 8 characters, including a mix of letters, numbers, and special characters.")
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "At least 8 characters, including a mix of letters, numbers, and special characters."
        )
        .required("Please enter your password"),
    confirm_password: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref("password"), null], "Password must match"),
});

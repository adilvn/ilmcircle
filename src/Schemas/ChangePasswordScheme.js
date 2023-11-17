import * as Yup from "yup";

export const ChangePasswordSchema = Yup.object({
    current_password: Yup.string()
        .required("Please enter your current password"),
    new_password: Yup.string().min(8, "At least 8 characters, including a mix of letters, numbers, and special characters.")
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "At least 8 characters, including a mix of letters, numbers, and special characters."
        ).required("Please enter your new password"),
    repeat_new_password: Yup.string()
        .oneOf([Yup.ref("new_password"), null], "The two passwords do not match.")
        .required("Please repeat your new password"),
});

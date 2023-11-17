import * as Yup from "yup";


export const forgetScheme = Yup.object({
    email: Yup.string().email('Email must be a valid email').required("Please enter your email"),
});
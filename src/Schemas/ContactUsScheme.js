import * as Yup from "yup";

export const contactusScheme = Yup.object({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().email("Email must be a valid email").required("Please enter your email"),
    message: Yup.string().required("Please enter your message "),


});







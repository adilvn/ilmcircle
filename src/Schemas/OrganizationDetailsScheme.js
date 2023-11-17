import * as Yup from "yup";

export const organizationScheme = Yup.object({
    orgName: Yup.string().required("Please enter Organization Name"),
    orgAddress: Yup.string().required("Please enter Address"),
    orgWebsite: Yup.string().required("Please enter Website"),
    orgEmail: Yup.string().email("Email must be a valid email").required("Please enter your Contact Email"),
    orgIntro: Yup.string().required("Please enter your Introduction "),


});







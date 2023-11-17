// const SERVER = "https://alhikmahinternational.org/ilmcircle/"
const SERVER = "https://ilmcircle.com/backend/";


export default {
    LOGIN: SERVER + "api/user/login",
    SIGNUP: SERVER + "api/user/signup",
    FORGETPASSWORD: SERVER + "api/user/auth/forget",
    NEWPASSWORD: SERVER + "api/user/auth/newpassword",
    GETSUBSCRIPTIONINVOICE: SERVER + "api/student/subscription/invoice",
    GETNOTIFICATION: SERVER + "api/student/notification",
    GETNOTIFICATIONORG: SERVER + "api/organization/notification",
    UPDATENOTIFICATIONORG: SERVER + "api/organization/notification/update",

    UPDATENOTIFICATION: SERVER + "api/student/notification/update",

    SENDACOPY: SERVER + "api/page/send/copy",


    ABOUTUS: SERVER + "api/page/about",
    CONTACTUS: SERVER + "api/page/contactus/message",
    ALLFAQS: SERVER + "api/page/faq",
    SOCIALLINKS: SERVER + "api/page/setting",
    GETFAVORITE: SERVER + "api/student/favorite/all",
    ADDTOFAVORITE: SERVER + "api/student/favorite/update",
    GETSUBSCRIPTIONDATA: SERVER + "api/student/subscription",
    CANCELSUBSCRIPTION: SERVER + "api/student/subscription/cancel",
    SENDMSGREQUEST: SERVER + "api/student/message/create",
    SENDMSG: SERVER + "api/student/message/send",
    ADDMEMBERORGANIZATION: SERVER + "api/organization/profile/member",

    NOTIFYMEHOME: SERVER + "api/notify/create",
    STU_PROFILE: SERVER + "api/student/editprofile",
    GETMEMORIZATIONTIPS: SERVER + "api/student/tip",

    // UPDATEGOALTASK: SERVER + "api/student/editprofile",
    GETALLGOALTASK: SERVER + "api/student/task/get",
    CREATEGOALTASK: SERVER + "api/student/task/create",
    UPDATEDGOALSTASK: SERVER + "api/student/task/update",
    DELETEGOALSTASK: SERVER + "api/student/task/delete",
    ORGEDIT_PTOFILE: SERVER + "api/organization/editprofile",
    GETORGPROFILE: SERVER + "api/organization/profile",
    SENDLIBDATA: SERVER + "api/organization/library/create",
    GETLIBDATA: SERVER + "api/organization/library/get",
    ORGUPDATEEVENT: SERVER + "api/organization/event/update",
    PINUNPINEVENTS: SERVER + "api/organization/pin/update",
    DELETEEVENTS: SERVER + "api/organization/event/delete",
    CREATEEVENTS: SERVER + "api/organization/event/create",
    EVENTSREVIEWS: SERVER + "api/organization/review/event/",
    UPDATEEVENTSREVIEWS: SERVER + "api/organization/review/update",
    GETEVENTSDETAILS: SERVER + "api/organization/event/",
    GETISLAMICULTUREPROFILEDATA: SERVER + "api/student/profile/",

    FEEDBACKMAIN: SERVER + "api/organization/feedback/organization",
    UPDATEFEEDBACK: SERVER + "api/organization/feedback/update",
    GETVACANCY: SERVER + "api/organization/vacancy/all",
    CREATEVACANCY: SERVER + "api/organization/vacancy/create",
    VACANCYDETAILS: SERVER + "api/organization/vacancy/detail/",
    UPDATEVACANCY: SERVER + "api/organization/vacancy/update",
    DELETEVACANCY: SERVER + "api/organization/vacancy/delete",
    GETEVENTFEEDBACK: SERVER + "api/organization/feedback/event/",
    LEAVEFEEDBACK: SERVER + "api/student/feedback/create",

    //Organization Module
    ALLEVENTS: SERVER + "api/organization/allevents",
    GETFEEDBACK: SERVER + "api/organization/feedback/organization",
    GETREVIEWS: SERVER + "api/organization/review/organization",
    UPDATEREVIEWS: SERVER + "api/organization/review/update",
    ORGALLPROJECTS: SERVER + "api/organization/project/organization",
    ORGPROJECTDETAILS: SERVER + "api/organization/project/organization/",
    UPDATEPROJECT: SERVER + "api/organization/project/update",
    DELETEPROJECT: SERVER + "api/organization/project/delete",
    CREATEPROJECT: SERVER + "api/organization/project/create",
    GETANALYTICS: SERVER + "api/organization/analytic/organization",

    //Events Administration data  
    GETADMINPROJECTS: SERVER + "api/student/project/all/",
    PROJECTDONATENOW: SERVER + "api/student/project/donate",
    EVENTALLVACANCY: SERVER + "api/student/vacancy/all/",
    GETALLEVENTSADMIN: SERVER + "api/student/allevents/",
    GETEVENTLIBRARYDATA: SERVER + "api/student/library/all/",
    GETALLBUDDIES: SERVER + "api/student/allbuddies",

    GETBUDDYDETAILS: SERVER + "api/student/buddy/",



    PRICINGPLANS: SERVER + "api/page/packages",

    LOGOUT: SERVER + "",
    PROFILEUPDATE: SERVER + "",
    STATUS: SERVER + "",
}
export const url = "https://ilmcircle.com/backend/";
// export const url = "https://alhikmahinternational.org/ilmcircle/";


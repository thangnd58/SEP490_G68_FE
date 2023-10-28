export const BASE_URL = "https://hzuzmhgcmt.ap-southeast-1.awsapprunner.com/api";
export const ROUTES = {
    homepage: "/",
    account: {
        login: "/login",
        register: "/register",
        resetpassword: "/reset-password",
        verifyrequired: "/verify-required",
        userverification: "/user-verification",
        setpassword: "/set-password"
    },
    user: {
        userprofile: "/user-profile",
        registermotorbike: "/register-motorbike",
        listmotorbike: "/list-motorbike",
        updateregistermotorbike: "/update-register-motorbike",
    },

    component: {
        mymaparea: "/map-area",
        equipment: "/equipment",
        mymapwithsearch: "/map-with-search",
    },

    admin: {
        managemotorbikes: "/manage-motorbikes",
        managelicences: "/manage-licences",
        licenceregister: "/manage-licences/licence-detail",
        motorbikeregister: "/manage-motorbikes/motorbike-detail"
    },
    other:{
        pagenotfound: "/page-not-found",
    }
    
}
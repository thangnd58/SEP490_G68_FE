export const BASE_URL = "https://hzuzmhgcmt.ap-southeast-1.awsapprunner.com/api";
export const ROUTES = {
    homepage: "/",
    newspage: "/news",
    search: {
        filtermotorbike: "/search/filter"
    },
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
        introductionmotorbike: "/introduction-motorbike",
        listmotorbike: "/list-motorbike",
        shoppingCart: "/cart",
        updateregistermotorbike: "/update-register-motorbike",
        wallet: "/my-wallet",
        favourite: "/my-favourite",
        detailmotorbike: "/detail-motorbike",
    },
    booking: {
        detail: "booking-detail",
        mybooking: "/my-booking", 
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
        motorbikeregister: "/manage-motorbikes/motorbike-detail",
        managerequestwithdraw: "/manage-withdrawals",
        managerBrand: "/manage-brands",
        manageNews: "/manage-news",
        managePromotion: "/manage-promotions"
    },
    other: {
        pagenotfound: "/page-not-found",
    },
    cart:"/cart"

}

export const BookingStatus = {
    PendingPayment: "PendingPayment",
    Paid: "Paid",
    Cancelled: "Cancelled",
    PendingDelivery: "PendingDelivery",
    Delivered: "Delivered",
    PendingReview: "PendingReview",
    Finished: "Finished",
}

export const BookingPaymentType =
{
    UserBalance: "UserBalance",
    Card: "Card",
    EWallet: "EWallet",
    BankTransfer: "BankTransfer",
}

export const BookingDeliveryMode =
{
    SelfPickup: "SelfPickup",
    DeliveryService: "DeliveryService",
}
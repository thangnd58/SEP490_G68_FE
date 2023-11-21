export const BASE_URL = "https://hzuzmhgcmt.ap-southeast-1.awsapprunner.com/api";
export const ROUTES = {
    homepage: "/",
    newspage: "/news",
    promotionpage: "/promotion",
    search: {
        filtermotorbike: "/search/filter",
        searchprovince: "/search/province",
        searchplace: "/search/place"
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
        previewbecomeanowner: "/preview-become-an-owner",
        listmotorbike: "/list-motorbike",
        shoppingCart: "/cart",
        updateregistermotorbike: "/update-register-motorbike",
        wallet: "/my-wallet",
        favourite: "/my-favourite",
        detailmotorbike: "/detail-motorbike",
    },
    booking: {
        detail: "booking-detail",
        detail_owner: "booking-detail-owner",
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
        managePromotion: "/manage-promotions",
        managerModel : "/manage-models",
        manageReport: "/manage-reports"
    },
    other: {
        pagenotfound: "/page-not-found",
    },
    cart:"/cart",
    guide :{
        commonguide: "/common-guide",
        bookingguide: "/booking-guide",
        paymentguide: "/payment-guide",
        regulationguide: "/regulation-guide",
    }

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

export const ReportStatus =
{
    PendingResponse: "PendingResponse",
    Responded: "Responded",
}
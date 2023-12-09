import { Motorbike } from "./type";

export const BASE_URL = "https://hzuzmhgcmt.ap-southeast-1.awsapprunner.com/api";
export const ROUTES = {
    homepage: "/",
    newspage: "/news",
    promotionpage: "/promotion",
    policy: "/policy",
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
        dashboard: "/dashboard",
        managemotorbikes: "/manage-motorbikes",
        managelicences: "/manage-licences",
        licenceregister: "/manage-licences/licence-detail",
        motorbikeregister: "/manage-motorbikes/motorbike-detail",
        managerequestwithdraw: "/manage-withdrawals",
        managerBrand: "/manage-brands",
        manageNews: "/manage-news",
        managePromotion: "/manage-promotions",
        managerModel: "/manage-models",
        manageReport: "/manage-reports",
        managerUser: "/manage-user",
        managerFeedback: "/manage-feedback",
    },
    other: {
        pagenotfound: "/page-not-found",
        guide: {
            generalguide: "/general-guide",
            bookingguide: "/booking-guide",
            paymentguide: "/payment-guide",
            regulationguide: "/regulation-guide",
        }
    },
    cart: "/cart",
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


export const CategoryNews = {
    news: "NEWS",
    policy: "POLICY",
    guildeline: "GUIDELINE",
}

export const GuildlineType = {
    general: "general",
    booking: "booking",
    payment: "payment",
    regulation: "regulation",
}

export const dummyMotorbike: Motorbike = {
    id: 1,
    licensePlate: "ABC123",
    releaseYear: 2022,
    type: "Scooter",
    priceRent: 30,
    equipments: "Helmet, Lock",
    fuelConsumption: 3.5,
    maxDeliveryDistance: 50,
    freeDeliveryRange: 10,
    feeOfDeliveryPerKm: 1.5,
    provinceId: 1,
    districtId: 1,
    wardId: 1,
    image: "motorbike_image.jpg",
    imageUrl: ["image1.jpg", "image2.jpg"],
    address: "123 Main Street",
    location: "40.7128° N, 74.0060° W", // Example coordinates for New York City
    status: "Available",
    statusComment: null,
    user: {
        userId: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        gender: "Male",
        dob: "1990-01-01",
        address: "456 Second Street",
        avatar: "user_avatar.jpg",
        password: "hashed_password",
        avatarUrl: "user_avatar_url.jpg",
        deleted: true,
        role: {
            roleId: 1,
            roleName: "User",
            deleted: false,
            createDatetime: "2022-01-01",
            updateDatetime: "2022-01-01",
            createUserId: 1,
            updateUserId: 1,
        },
        phoneVerified: true,
        balance: 100,
        createDatetime: "2022-01-01",
        googleIdentity: "google_id",
        motorbikes: [],
        totalBooking: 0,
        averageRating: 0,
    },
    createDatetime: "2022-01-01",
    model: {
        id: 1,
        modelName: "Scooter Model X",
        modelImage: "model_image.jpg",
        brand: {
            id: 1,
            brandName: "Scooter Brand",
            brandImage: "brand_image.jpg",
            createDate: "2022-01-01",
            numberOfModel: 1,
        },
        numberOfMotorbike: 1,
        createdDate: "2022-01-01",
        updatedDate: "2022-01-01",
        brandId: 1,
        brandName: "Scooter Brand",
    },
    miscellaneous: "Additional info",
    description: "A cool scooter for rent",
    distance: 0,
    isFavourite: false,
    ratingAverage: 0,
    countCompletedBooking: 0,
    deliveryDistanceChargeable: 0,
    totalFeeOfDelivery: 0,
    modelName: "Scooter Model X",
    brandName: "Scooter Brand",
    feedbacks: [],
    isDeleting: false,
};

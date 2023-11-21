export interface User {
    userId: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    address: string;
    avatar: string;
    password?: string;
    avatarUrl: string;
    role: Role;
    phoneVerified: boolean;
    balance: number;
    googleIdentity: string;
}

export interface Role {
    roleId: number;
    roleName: string;
    deleted: boolean;
    createDatetime: string;
    updateDatetime: string;
    createUserId: number;
    updateUserId: number;
}

export interface Lisence {
    licenceId: number;
    userId: number;
    licenceNumber: string;
    fullName: string;
    dob: string;
    licenceImage: string;
    licenceImageUrl: string;
    status: number;
    createDateTime: string;
}

export interface ResetPassword {
    ticket: string;
    password: string;
    confirmPassword: string;
}

export interface ImageUpload {
    tableName: string;
    columnName: string;
    code: string;
    fileName: string;
}

export interface Model {
    id: number,
    modelName: string,
    modelImage: string,
    brand: Brand,
    numberOfMotorbike: number,
    createdDate: string,
    updatedDate: string,
    brandId: number,
    brandName: string,
}

export interface Brand {
    id: number,
    brandName: string,
    brandImage: string,
    createDate: string,
    numberOfModel: number
}


export interface Province {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts: District[];
}

export interface District {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    province_code: number;
    wards: Ward[];
}

export interface Ward {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
}

export interface Motorbike {
    id?: number,
    motorbikeId?: number,
    licensePlate: string,
    releaseYear: number,
    type: string,
    priceRent: number,
    equipments: string,
    fuelConsumption: number,
    maxDeliveryDistance: number,
    freeDeliveryRange: number,
    feeOfDeliveryPerKm: number,
    provinceId: number,
    districtId: number,
    wardId: number,
    image: string,
    imageUrl: string[],
    address: string,
    location: string,
    status: string,
    statusComment: any,
    user: User,
    createDatetime: string,
    model: Model | any,
    miscellaneous: string,
    description: string,
    distance: number,
    isFavourite: boolean,
    ratingAverage: number,
    countCompletedBooking: number,
    deliveryDistanceChargeable: number,
    totalFeeOfDelivery: number,
}

export interface MotorbikeRequest {
    id?: number,
    licensePlate: string,
    releaseYear: number,
    type: string,
    priceRent: number,
    equipments: string,
    fuelConsumption: number,
    maxDeliveryDistance: number,
    freeDeliveryRange: number,
    feeOfDeliveryPerKm: number,
    provinceId: number,
    districtId: number,
    wardId: number,
    image: string,
    address: string,
    location: string,
    modelId: number,
    description: string,
    miscellaneous: string,

}

export interface Bank {
    bin: string;
    code: string;
    id: number;
    isTransfer: number;
    logo: string;
    name: string;
    lookupSupported: number;
    shortName: string;
    short_name: string;
    swift_code: string;
    transferSupported: number;
    support: number;
}

export interface WalletHistory {
    id: number;
    deposit?: number;
    withdraw?: number;
    create_Date: string;
    dateApprove?: string;
    status?: string;
    userId: number;
    transactionId: string;
}

export interface RequestWithDrawal {
    amount: number;
    bankCode: string;
    nameInBank: string;
    bankNumber: string;
}

export interface ResponseWithDrawal {
    id: number;
    deposit: number;
    withdraw: number;
    create_Date: string;
    dateApprove: string;
    userApprove: string;
    transactionId: string;
    bankCode: string;
    nameInBank: string;
    bankNumber: string;
    status: string;
    userId: number;
}

export interface UserFavourite {
    userId: number;
    motorbikeId: number;
    createDatetime: string;
    motorbike: MotorbikeFavourite;
}
export interface MotorbikeFavourite {
    id: number;
    priceRent: number;
    equipments: string;
    fuelConsumption: number;
    provinceId: number;
    districtId: number;
    wardId: number;
    imageUrl: string;
    address: string;
    location: string;
    miscellaneous: string;
    brandName: string;
    modelName: string;
    user: UserForRent;
    isFavourite: boolean;
}

export interface UserForRent {
    userId: number;
    name: string;
    avatarUrl: string;
}

export interface SearchMotorbikeRequest {
    address: string,
    startDate: string,
    endDate: string,
    minPrice?: number,
    maxPrice?: number,
    type?: string,
    brandId?: number,
    minReleaseYear?: number,
    maxReleaseYear?: number,
    minFuelConsumption?: number,
    maxFuelConsumption?: number,
    equipments?: string,
    minDistance?: number,
    maxDistance?: number,
    maximumRating?: boolean,
    orderBy?: string,
}

export interface BookingRequest {
    motorbikeId: string;
    deliveryMode: string;
    address: string;
    startDatetime: string;
    endDatetime: string;
    couponCode: string;
}

export interface BookingResponse {
    motorbikeId: number,
    deliveryMode: string,
    address: string,
    startDatetime: string,
    endDatetime: string,
    rentalDays: number,
    motorbikes: Motorbike[],
    feeOfService: number,
    totalAmountTemp: number,
    couponCode: string,
    totalAmount: number,
    promotion: PromotionResponse,
    status: string,
}

interface PromotionResponse {
    id: number,
    code: string,
    image: string,
    startDate: string,
    endDate: string,
    type: string,
    maxValue: number,
    minValue: number,
    value: number,
    numberLeft: number,
    status: string,
    statusComment: any,
    dateCreated: string,
    originalAmount: number,
    reducedAmount: number
}

export interface Booking {
    bookingId: number;
    deliveryMode: string;
    address: string;
    startDatetime: string;
    endDatetime: string;
    rentalDays: number;
    motorbikes: Motorbike[];
    feeOfService: number;
    totalAmountTemp: number;
    reducedAmount: number,
    totalAmount: number;
    paymentType: string;
    status: string;
    createDatetime: string;
    updateDatetime: string;
    createUserId: number;
    updateUserId: number;
    promotion: Promotion,
    deposit: number
}

export interface Notification {
    notificationId: number,
    userId: number,
    title: string,
    detail: string,
    isRead: boolean,
    createDatetime: string,
    updateDatetime: string,
    category: NotificationCategory
}

export interface NotificationCategory {
    categoryId: number,
    categoryName: string,
    image: string
}

export interface News {
    newsId: number;
    image: string;
    imageUrl: string;
    category: string;
    title: string;
    detail: string;
    createDatetime: string;
    updateDatetime: string;
}

export interface NewsRequest {
    image: string;
    category: string;
    title: string;
    detail: string;
}

export interface ShoppingCart {
    address: string;
    startDatetime: string;
    endDatetime: string;
    rentalDays: string;
    motorbikes: MotorbikeCart[];
    feeOfService: number;
    totalAmountTemp: number;
    couponCode: string;
    totalAmount: number;
}

export interface MotorbikeCart {
    motorbikeId: number;
    user: User;
    imageUrl: string[];
    model: string;
    licensePlate: string;
    type: string;
    address: string;
    location: string;
    maxDeliveryDistance: number;
    distance: number;
    freeDeliveryRange: number;
    deliveryDistanceChargeable: number;
    feeOfDeliveryPerKm: number;
    totalFeeOfDelivery: number;
    priceRent: number;
    enableInsurance: boolean;
    feeOfInsurance: number;
    totalPriceRent: number;
    status: string;
    statusComment: string[];
}


export interface Promotion {
    id: number,
    code: string,
    title: string,
    description: string,
    image: string,
    imageUrl: string,
    startDate: string,
    endDate: string,
    type: string,
    maxValue: number,
    minValue: number,
    value: number,
    numberLeft: number,
    status: true,
    userCreated: number,
    dateCreated: string
}

export interface PromotionRequest {
    code: string,
    title: string,
    description: string,
    image: string,
    startDate: string,
    endDate: string,
    type: string,
    maxValue: number,
    minValue: number,
    value: number,
    numberLeft: number,
}

export interface FeedbackRequest {
    bookingId: number,
    motorbikeId: number,
    rating: number,
    comment: string
}

export interface CartInforResponse {
    bookingCartId: number,
    address: string,
    startDatetime: string,
    endDatetime: string,
    status: string,
    motorbikes: Motorbike[]
}

export interface PopularLocation {
    code: number,
    name: string,
    address: string,
    location: string,
    imageUrl: string,
    count: number
}

export interface PopularProvince {
    code: number,
    name: string,
    address: string,
    location: string,
    imageUrl: string,
    count: number
}

export interface ReportCategory {
    categoryId: number,
    categoryName: string,
    image: string
}

export interface ReportRequest {
    categoryId: number,
    detail: string
}

export interface Report {
    reportId: number,
    category: ReportCategory,
    detail: string,
    reporter: Reporter,
    responder: Reporter,
    status: string,
    statusComment: string,
    createDatetime: string,
    updateDatetime: string
}

export interface Reporter {
    userId: number,
    name: string,
    avatarUrl: string
}
export interface User {
    userId: number,
    name: string,
    email: string,
    phone: string,
    gender: string,
    dob: string,
    address: string,
    avatar: string,
    password?: string,
    avatarUrl: string,
    role: Role,
    phoneVerified: boolean,
    balance: number,
    googleIdentity: string
}

export interface Role {
    roleId: number,
    roleName: string,
    deleted: boolean,
    createDatetime: string,
    updateDatetime: string,
    createUserId: number,
    updateUserId: number
}


export interface Lisence {
    licenceId: number,
    userId: number,
    licenceNumber: string,
    fullName: string,
    dob: string,
    licenceImage: string,
    licenceImageUrl: string,
    status: number,
    createDateTime: string
}

export interface ResetPassword {
    ticket: string,
    password: string,
    confirmPassword: string
}

export interface ImageUpload {
    tableName: string,
    columnName: string,
    code: string,
    fileName: string
}

export interface Model {
    id: number,
    modelName: string,
    modelImage: string,
    brand: Brand
}

export interface Brand {
    id: number,
    brandName: string,
    brandImage: string
}

export interface Province {
    name: string,
    code: number,
    division_type: string,
    codename: string,
    phone_code: number,
    districts: District[]
}

export interface District {
    name: string,
    code: number,
    division_type: string,
    codename: string,
    province_code: number,
    wards: Ward[]
}

export interface Ward {
    name: string,
    code: number,
    division_type: string,
    codename: string,
    district_code: number
}

export interface Motorbike {
    id?: number,
    licensePlate: string,
    releaseYear: number,
    type: string,
    priceRent: number,
    equipments: string,
    fuelConsumption: number,
    maxDeliveryDistance: number,
    freeDeliveryDistance: number,
    feeDeliveryDistance: number,
    provinceId: number,
    districtId: number,
    wardId: number,
    image: string,
    imageUrl: string[],
    address: string,
    location: string,
    status: string,
    statusComment: string,
    user: User,
    createDatetime: string,
    model: Model | any,
    miscellaneous: string,
    description: string,
    distance: number,
    isFavourite: boolean,
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
    freeDeliveryDistance: number,
    feeDeliveryDistance: number,
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
    bin: string,
    code: string,
    id: number,
    isTransfer: number,
    logo: string,
    name: string,
    lookupSupported: number,
    shortName: string,
    short_name: string,
    swift_code: string,
    transferSupported: number
    support: number,
}

export interface WalletHistory {
    id: number,
    deposit?: number,
    withdraw?: number,
    create_Date: string,
    dateApprove?: string,
    status?: string,
    userId: number,
    transactionId: string
}

export interface RequestWithDrawal {
    amount: number,
    bankCode: string,
    nameInBank: string,
    bankNumber: string
}


export interface ResponseWithDrawal {
    id: number,
    deposit: number,
    withdraw: number,
    create_Date: string,
    dateApprove: string,
    userApprove: string,
    transactionId: string,
    bankCode: string,
    nameInBank: string,
    bankNumber: string,
    status: string,
    userId: number
}

export interface UserFavourite {
    userId: number,
    motorbikeId: number,
    createDatetime: string,
    motorbike: MotorbikeFavourite
}
export interface MotorbikeFavourite {
    id: number,
    priceRent: number,
    equipments: string,
    fuelConsumption: number,
    provinceId: number,
    districtId: number,
    wardId: number,
    imageUrl: string,
    address: string,
    location: string,
    miscellaneous: string,
    brandName: string,
    modelName: string,
    user: UserForRent,
    isFavourite: boolean
}

export interface UserForRent {
    userId: number,
    name: string,
    avatarUrl: string
}

export interface SearchMotorbikeRequest {
    startDate: string,
    endDate: string,
    address: string
}


export interface BookingRequest {
    motorbikeId: number,
    deliveryMode: string,
    address: string,
    startDatetime: string,
    endDatetime: string,
    couponCode: string
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
    couponPrice: number,
    totalAmount: number
}

export interface Booking {
    bookingId: number,
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
    paymentType: string,
    status: string,
    createDatetime: string,
    updateDatetime: string,
    createUserId: number,
    updateUserId: number
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
    newsId: number,
    image: string,
    imageUrl: string,
    category: string,
    title: string,
    detail: string,
    createDatetime: string,
    updateDatetime: string
}

export interface NewsRequest {
    image: string,
    category: string,
    title: string,
    detail: string
}

export interface Promotion {
    id: number,
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
    status: true,
    userCreated: number,
    dateCreated: string
}
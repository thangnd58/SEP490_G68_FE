export interface User {
    userId: number,
    name: string,
    password?: string,
    email: string,
    phone: string,
    gender: string,
    dob: string,
    address: string,
    avatar: string,
    avatarUrl: string,
    role: Role
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
    status: number
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
    modelImage: string
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


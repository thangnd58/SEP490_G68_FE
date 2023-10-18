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


export interface Lisence  {
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
    code:  string,
    fileName: string
}

export interface Motorbike {
    id?: number,
    motorbikeName: string,
    licensePlate: string,
    type: string,
    priceRent: number,
    equipments: string,
    fuelConsumption: number,
    provinceId: number,
    districtId: number,
    wardId: number,
    image: string,
    address:string,
    location: string,
    modelId: number,
    status: number,
    createDatetime: string
}
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
    code:  string,
    fileName: string
}
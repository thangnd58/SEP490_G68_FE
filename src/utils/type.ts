export interface User {
    userId: number,
    name: string,
    password?: string,
    email: string,
    phone: string,
    gender: string,
    dob: number,
    address: string,
    avatar: string,
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
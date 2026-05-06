export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    STORE_OWNER = "store_owner"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    ratings: any[];
    stores: any[];
}

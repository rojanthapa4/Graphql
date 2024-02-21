export interface SignupInterface {
    username: string;
    email: string;
    password: string;
}

export interface LoginInterface {
    username: string;
    password: string;
}

export interface UpdateUserInterface {
    id: string;
    username?: string;
    email?: string;
}

export interface DeleteInterface {
    id: string;
}

export interface UserInterface {
    id?:string;
    userName?:string;
    email?:string;
}

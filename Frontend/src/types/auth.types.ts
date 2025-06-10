// Auth related TypeScript interfaces 

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupCredentials {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface AuthError {
    message: string;
    status: number;
} 
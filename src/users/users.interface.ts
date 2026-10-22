export interface Users {
    id: number;
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    role: 'user' | 'staff' | 'admin';
    createdAt?: string;
}

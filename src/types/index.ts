export type Role = 'OWNER' | 'PARTNER' | 'STAFF';

export type BookRole = 'ADMIN' | 'OPERATOR' | 'VIEWER';

export interface OperatorPermissions {
    canEditEntries: boolean;
    canAddBackdatedEntries: boolean;
    canViewNetBalance: boolean;
    canViewOtherEntries: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

export interface Member extends User {
    role: Role;
    status: 'ACTIVE' | 'INVITED';
    joinedAt: string;
}

export interface BookMember extends User {
    bookRole: BookRole;
    permissions?: OperatorPermissions;
}

export interface Business {
    id: string;
    name: string;
    category: string;
    industry: string;
    type: string;
    staffSize: string;
    address?: string;
    members: Member[];
    createdAt: string;
}


export type PaymentMode = 'Cash' | 'Online' | 'Bank' | 'UPI' | 'Card';

export interface Transaction {
    id: string;
    amount: number;
    type: 'IN' | 'OUT';
    remark?: string;
    category: string;
    paymentMode: PaymentMode;
    date: string; // ISO string
    time: string;
    contact?: string; // Contact name/id
    attachments?: string[];
    createdBy: string; // User ID
    balance?: number; // Running balance
}

export interface Cashbook {
    id: string;
    businessId: string;
    name: string;

    members: string[]; // Legacy user IDs
    bookMembers: BookMember[]; // Detailed member roles for this book
    transactions: Transaction[];
    stats: {
        totalIn: number;
        totalOut: number;
        netBalance: number;
    };
    lastUpdated: string;
}


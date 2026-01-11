import { Business, Cashbook, User } from "@/types";

export const sampleUser: User = {
    id: "u1",
    name: "Abduselam",
    email: "abduselam@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abduselam"
};

export const sampleBusiness: Business = {
    id: "b1",
    name: "My Awesome Business",
    category: "Retail",
    industry: "Electronics",
    type: "Private Limited",
    staffSize: "1-5",
    address: "123 Business St, Tech City",
    createdAt: new Date().toISOString(),
    members: [
        { ...sampleUser, role: 'OWNER', status: 'ACTIVE', joinedAt: new Date().toISOString() },
        {
            id: "u2",
            name: "John Doe",
            email: "john@example.com",
            role: 'STAFF',
            status: 'ACTIVE',
            joinedAt: new Date().toISOString(),
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        }
    ]
};

export const sampleCashbooks: Cashbook[] = [
    {
        id: "cb1",
        businessId: "b1",
        name: "September Expenses",
        members: ["u1", "u2"],

        bookMembers: [
            { ...sampleUser, bookRole: 'ADMIN' },
            {
                id: "u2",
                name: "John Doe",
                email: "john@example.com",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
                bookRole: 'OPERATOR',
                permissions: {
                    canEditEntries: true,
                    canAddBackdatedEntries: false,
                    canViewNetBalance: true,
                    canViewOtherEntries: true
                }
            }
        ],
        lastUpdated: new Date().toISOString(),
        stats: {
            totalIn: 50000,
            totalOut: 12500,
            netBalance: 37500
        },
        transactions: [
            {
                id: "t1",
                amount: 50000,
                type: 'IN',
                category: 'Project Advance',
                paymentMode: 'Bank',
                date: new Date().toISOString(),
                time: "10:00 AM",
                remark: "Initial advance for project A",
                createdBy: "u1",
                balance: 50000
            },
            {
                id: "t2",
                amount: 2500,
                type: 'OUT',
                category: 'Travel',
                paymentMode: 'Cash',
                date: new Date().toISOString(),
                time: "02:30 PM",
                remark: "Taxi to client site",
                createdBy: "u1",
                balance: 47500
            },
            {
                id: "t3",
                amount: 10000,
                type: 'OUT',
                category: 'Equipment',
                paymentMode: 'Card',
                date: new Date().toISOString(),
                time: "04:15 PM",
                remark: "New Monitor",
                createdBy: "u2",
                balance: 37500
            }
        ]
    },
    {
        id: "cb2",
        businessId: "b1",
        name: "Petty Cash",
        members: ["u1"],

        bookMembers: [
            { ...sampleUser, bookRole: 'ADMIN' }
        ],
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        stats: {
            totalIn: 5000,
            totalOut: 1200,
            netBalance: 3800
        },
        transactions: []
    }
];


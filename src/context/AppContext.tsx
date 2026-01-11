"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Business, Cashbook, User, Role, BookRole, OperatorPermissions } from '@/types';
import { sampleBusiness, sampleCashbooks, sampleUser } from '@/lib/sample-data';
import { getStorage, setStorage } from '@/lib/storage';

interface AppContextType {
    user: User | null;
    business: Business | null;
    businesses: Business[];
    cashbooks: Cashbook[];
    loading: boolean;
    syncStatus: 'idle' | 'syncing' | 'saved' | 'error';
    login: () => void;
    logout: () => void;
    switchBusiness: (id: string) => void;
    addBusiness: (name: string) => void;
    addCashbook: (name: string) => void;
    updateCashbook: (id: string, updates: Partial<Cashbook>) => void;
    deleteCashbook: (id: string) => void;
    inviteMember: (email: string, role: Role) => Promise<void>;

    updateMemberRole: (memberId: string, role: Role) => void;
    updateBookMember: (bookId: string, memberId: string, role: BookRole, permissions?: OperatorPermissions) => void;
    joinBusiness: (businessId: string, role: Role) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [cashbooks, setCashbooks] = useState<Cashbook[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');
    const isInitialLoad = useRef(true);

    // Initial Load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            if (status === 'authenticated' && session?.accessToken) {
                // Load from Drive
                try {
                    const res = await fetch('/api/sync');
                    const json = await res.json();

                    if (json.data) {
                        setUser(json.data.user);
                        setBusiness(json.data.business);
                        setCashbooks(json.data.cashbooks);
                    } else {
                        // Initialize new user with sample data
                        const newUser = { ...sampleUser, name: session.user?.name || 'User', email: session.user?.email || 'user@example.com', avatar: session.user?.image || undefined };
                        setUser(newUser);
                        setBusiness(sampleBusiness);
                        setCashbooks(sampleCashbooks);
                    }
                } catch (error) {
                    console.error("Failed to load from Drive", error);
                }
            } else if (status === 'unauthenticated') {
                // Fallback to LocalStorage for guest/dev mode if not using NextAuth
                const loadedUser = getStorage<User | null>('user', null);
                const loadedBusiness = getStorage<Business | null>('business', null);
                const loadedBusinesses = getStorage<Business[]>('businesses', []);
                const loadedCashbooks = getStorage<Cashbook[]>('cashbooks', []);

                if (loadedUser) setUser(loadedUser);
                if (loadedBusiness) setBusiness(loadedBusiness);
                else if (loadedBusinesses.length > 0) setBusiness(loadedBusinesses[0]);

                if (loadedBusinesses.length > 0) setBusinesses(loadedBusinesses);
                if (loadedCashbooks.length > 0) setCashbooks(loadedCashbooks);
            }

            setLoading(false);
            isInitialLoad.current = false;
        };

        if (status !== 'loading') {
            loadData();
        }
    }, [status, session]);

    // Persistence (Debounced Sync)
    useEffect(() => {
        if (loading || isInitialLoad.current) return;

        const saveData = async () => {
            setSyncStatus('syncing');
            const dataToSave = { user, business, cashbooks };

            if (status === 'authenticated') {
                try {
                    await fetch('/api/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: dataToSave })
                    });
                    setSyncStatus('saved');
                    setTimeout(() => setSyncStatus('idle'), 2000);
                } catch (error) {
                    console.error("Failed to save to Drive", error);
                    setSyncStatus('error');
                }
            } else {
                setStorage('user', user);
                setStorage('business', business);
                setStorage('businesses', businesses);
                setStorage('cashbooks', cashbooks);
                setSyncStatus('saved');
                setTimeout(() => setSyncStatus('idle'), 2000);
            }
        };

        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [user, business, cashbooks, loading, status]);

    const login = () => {
        setUser(sampleUser);
        setBusiness(sampleBusiness);
        setBusinesses([sampleBusiness]);
        if (cashbooks.length === 0) setCashbooks(sampleCashbooks);
    };

    const logout = () => {
        signOut({ callbackUrl: '/' });
        setUser(null);
        setBusiness(null);
        setStorage('user', null);
    };

    const addCashbook = (name: string) => {
        if (!business) {
            alert("Please select or create a business first");
            return;
        }

        const newBook: Cashbook = {
            id: `cb_${Date.now()}`,
            businessId: business.id,
            name,
            members: [user?.id || ''],
            bookMembers: user ? [{ ...user, bookRole: 'ADMIN' }] : [],
            transactions: [],
            stats: { totalIn: 0, totalOut: 0, netBalance: 0 },
            lastUpdated: new Date().toISOString()
        };
        setCashbooks(prev => [newBook, ...prev]);
    };


    const updateCashbook = (id: string, updates: Partial<Cashbook>) => {
        setCashbooks(prev => prev.map(book =>
            book.id === id ? { ...book, ...updates, lastUpdated: new Date().toISOString() } : book
        ));
    };

    const deleteCashbook = (id: string) => {
        setCashbooks(prev => prev.filter(book => book.id !== id));
    };

    const switchBusiness = (id: string) => {
        const found = businesses.find(b => b.id === id);
        if (found) setBusiness(found);
    };

    const addBusiness = (name: string) => {
        const newBusiness: Business = {
            ...sampleBusiness,
            id: `b_${Date.now()}`,
            name,
            members: [{ ...user!, role: 'OWNER', status: 'ACTIVE', joinedAt: new Date().toISOString() }],
            createdAt: new Date().toISOString()
        };
        setBusinesses(prev => [...prev, newBusiness]);
        setBusiness(newBusiness);
    };

    const inviteMember = async (email: string, role: Role) => {
        if (!business) return;

        try {
            const res = await fetch('/api/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    role,
                    businessName: business.name,
                    businessId: business.id
                })
            });

            const json = await res.json();
            if (json.error) {
                alert(`Error: ${json.error}`);
                return;
            }

            // Local state update (optimistic)
            const newMember = {
                id: `u_${Date.now()}`,
                name: email.split('@')[0],
                email,
                role,
                status: 'INVITED' as const,
                joinedAt: new Date().toISOString()
            };
            const updatedBusiness = {
                ...business,
                members: [...business.members, newMember]
            };
            setBusiness(updatedBusiness);
            setBusinesses(prev => prev.map(b => b.id === business.id ? updatedBusiness : b));

            alert(`Invitation sent to ${email} successfully!`);
        } catch (error) {
            console.error("Failed to send invitation", error);
            alert("Failed to send invitation. Please check your connection.");
        }
    };



    const updateMemberRole = (memberId: string, role: Role) => {
        if (!business) return;
        const updatedBusiness = {
            ...business,
            members: business.members.map(m => m.id === memberId ? { ...m, role } : m)
        };
        setBusiness(updatedBusiness);
        setBusinesses(prev => prev.map(b => b.id === business.id ? updatedBusiness : b));
    };

    const updateBookMember = (bookId: string, memberId: string, role: BookRole, permissions?: OperatorPermissions) => {
        setCashbooks(prev => prev.map(book => {
            if (book.id !== bookId) return book;

            const existingIndex = book.bookMembers.findIndex(m => m.id === memberId);
            let updatedMembers = [...book.bookMembers];

            if (existingIndex > -1) {
                updatedMembers[existingIndex] = { ...updatedMembers[existingIndex], bookRole: role, permissions };
            } else {
                // Find user info from business members
                const bizMember = business?.members.find(m => m.id === memberId);
                if (bizMember) {
                    updatedMembers.push({
                        id: bizMember.id,
                        name: bizMember.name,
                        email: bizMember.email,
                        bookRole: role,
                        permissions
                    });
                }
            }

            return { ...book, bookMembers: updatedMembers };
        }));
    };

    const joinBusiness = (businessId: string, role: Role) => {
        if (!user) return;

        setBusinesses(prev => {
            const bizIndex = prev.findIndex(b => b.id === businessId);
            if (bizIndex === -1) return prev;

            const biz = prev[bizIndex];
            if (biz.members.some(m => m.id === user.id)) return prev;

            const updatedBiz = {
                ...biz,
                members: [...biz.members, { ...user, role, status: 'ACTIVE' as const, joinedAt: new Date().toISOString() }]
            };
            const updatedBusinesses = [...prev];
            updatedBusinesses[bizIndex] = updatedBiz;

            // If it's the current business, update that too
            if (business?.id === businessId) {
                setBusiness(updatedBiz);
            }

            return updatedBusinesses;
        });
    };



    return (
        <AppContext.Provider value={{
            user,
            business,
            businesses,
            cashbooks,
            loading,
            syncStatus,
            login,
            logout,
            switchBusiness,
            addBusiness,
            addCashbook,
            updateCashbook,
            deleteCashbook,
            inviteMember,
            updateMemberRole,
            updateBookMember,
            joinBusiness
        }}>

            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

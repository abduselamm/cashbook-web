"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Business, Cashbook, User } from '@/types';
import { sampleBusiness, sampleCashbooks, sampleUser } from '@/lib/sample-data';
import { getStorage, setStorage } from '@/lib/storage';

interface AppContextType {
    user: User | null;
    business: Business | null;
    cashbooks: Cashbook[];
    loading: boolean;
    syncStatus: 'idle' | 'syncing' | 'saved' | 'error';
    login: () => void;
    logout: () => void;
    addCashbook: (name: string) => void;
    updateCashbook: (id: string, updates: Partial<Cashbook>) => void;
    deleteCashbook: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
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
                const loadedCashbooks = getStorage<Cashbook[]>('cashbooks', []);

                if (loadedUser) setUser(loadedUser);
                if (loadedBusiness) setBusiness(loadedBusiness);
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
                setStorage('cashbooks', cashbooks);
                setSyncStatus('saved');
                setTimeout(() => setSyncStatus('idle'), 2000);
            }
        };

        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [user, business, cashbooks, loading, status]);

    const login = () => {
        // Handled by NextAuth signIn() in the UI now
        // This legacy function can handle local-only dev mode
        setUser(sampleUser);
        setBusiness(sampleBusiness);
        if (cashbooks.length === 0) setCashbooks(sampleCashbooks);
    };

    const logout = () => {
        signOut({ callbackUrl: '/' });
        setUser(null);
        setBusiness(null);
        setStorage('user', null);
    };

    const addCashbook = (name: string) => {
        const newBook: Cashbook = {
            id: `cb_${Date.now()}`,
            name,
            members: [user?.id || ''],
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

    return (
        <AppContext.Provider value={{
            user,
            business,
            cashbooks,
            loading,
            syncStatus,
            login,
            logout,
            addCashbook,
            updateCashbook,
            deleteCashbook
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

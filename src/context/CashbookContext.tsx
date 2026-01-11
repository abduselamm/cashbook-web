"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cashbook, Transaction, BookRole, OperatorPermissions } from '@/types';
import { useApp } from '@/context/AppContext';

interface CashbookContextType {
    cashbook: Cashbook | null;
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdBy' | 'balance'>) => void;
    deleteTransaction: (id: string) => void;
    userRole: BookRole | 'NOT_MEMBER';
    userPermissions?: OperatorPermissions;
    loading: boolean;
}


const CashbookContext = createContext<CashbookContextType | undefined>(undefined);

export function CashbookProvider({
    children,
    cashbookId
}: {
    children: React.ReactNode;
    cashbookId: string;
}) {
    const { cashbooks, updateCashbook, user, loading: appLoading } = useApp();
    const [cashbook, setCashbook] = useState<Cashbook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (appLoading) return;

        const found = cashbooks.find(b => b.id === cashbookId);
        if (found) {
            setCashbook(found);
        } else {
            setCashbook(null);
        }
        setLoading(false);
    }, [cashbooks, cashbookId, appLoading]);

    const addTransaction = (data: Omit<Transaction, 'id' | 'createdBy' | 'balance'>) => {
        if (!cashbook || !user) return;

        // Calculate new balance
        // For simple running balance, we just update the global stats
        // In a real app, we'd calculate balance for each transaction based on history order

        // Update stats
        const newStats = { ...cashbook.stats };
        if (data.type === 'IN') {
            newStats.totalIn += data.amount;
            newStats.netBalance += data.amount;
        } else {
            newStats.totalOut += data.amount;
            newStats.netBalance -= data.amount;
        }

        const newTransaction: Transaction = {
            id: `tx_${Date.now()}`,
            createdBy: user.id,
            balance: newStats.netBalance,
            ...data
        };

        const updatedTransactions = [newTransaction, ...cashbook.transactions]; // Newest first

        updateCashbook(cashbook.id, {
            transactions: updatedTransactions,
            stats: newStats
        });
    };

    const deleteTransaction = (id: string) => {
        if (!cashbook) return;
        const tx = cashbook.transactions.find(t => t.id === id);
        if (!tx) return;

        const newStats = { ...cashbook.stats };
        if (tx.type === 'IN') {
            newStats.totalIn -= tx.amount;
            newStats.netBalance -= tx.amount;
        } else {
            newStats.totalOut -= tx.amount;
            newStats.netBalance += tx.amount;
        }

        const updatedTransactions = cashbook.transactions.filter(t => t.id !== id);

        updateCashbook(cashbook.id, {
            transactions: updatedTransactions,
            stats: newStats
        });
    };

    const memberInfo = cashbook?.bookMembers.find(m => m.id === user?.id);
    const userRole = memberInfo?.bookRole || (user ? 'NOT_MEMBER' : 'VIEWER');
    const userPermissions = memberInfo?.permissions;

    return (
        <CashbookContext.Provider value={{
            cashbook,
            transactions: cashbook?.transactions || [],
            addTransaction,
            deleteTransaction,
            userRole,
            userPermissions,
            loading: loading || appLoading
        }}>
            {children}
        </CashbookContext.Provider>
    );
}


export function useCashbook() {
    const context = useContext(CashbookContext);
    if (context === undefined) {
        throw new Error('useCashbook must be used within a CashbookProvider');
    }
    return context;
}

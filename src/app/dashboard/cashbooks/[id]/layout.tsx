"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { CashbookProvider } from '@/context/CashbookContext';

export default function CashbookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!id) return null;

    return (
        <CashbookProvider cashbookId={id}>
            {children}
        </CashbookProvider>
    );
}

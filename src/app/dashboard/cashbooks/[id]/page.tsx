"use client"

import React, { useState } from 'react';
import { useCashbook } from '@/context/CashbookContext';
import TransactionTable from '@/components/transactions/TransactionTable';
import { SummaryCards } from '@/components/transactions/SummaryCards';
import { Button } from '@/components/ui/Button';
import { Plus, Minus, FileDown, Search } from 'lucide-react';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

export default function CashbookPage() {
    const { cashbook, transactions, deleteTransaction, loading, userRole, userPermissions } = useCashbook();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>('IN');

    const handleOpenModal = (type: 'IN' | 'OUT') => {
        setTransactionType(type);
        setIsModalOpen(true);
    };

    const generatePDF = () => {
        if (!cashbook) return;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(cashbook.name, 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Stats
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Cash In: +${formatCurrency(cashbook.stats.totalIn)}`, 14, 40);
        doc.text(`Total Cash Out: -${formatCurrency(cashbook.stats.totalOut)}`, 14, 46);
        doc.text(`Net Balance: ${formatCurrency(cashbook.stats.netBalance)}`, 14, 52);

        // Table
        const tableData = transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.remark || '-',
            t.category,
            t.type === 'IN' ? `+${t.amount}` : '',
            t.type === 'OUT' ? `-${t.amount}` : '',
            t.paymentMode
        ]);

        autoTable(doc, {
            head: [['Date', 'Remark', 'Category', 'Cash In', 'Cash Out', 'Mode']],
            body: tableData,
            startY: 60,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [72, 99, 212] },
        });

        doc.save(`${cashbook.name}_Report.pdf`);
    };

    const canAdd = userRole !== 'VIEWER' && userRole !== 'NOT_MEMBER';
    const canDelete = userRole === 'ADMIN' || (userRole === 'OPERATOR' && userPermissions?.canEditEntries);
    const canViewBalance = userRole === 'ADMIN' || (userRole === 'OPERATOR' && userPermissions?.canViewNetBalance) || userRole === 'VIEWER';

    if (loading) return <div className="p-8 text-sm text-gray-500">Loading ledger...</div>;
    if (!cashbook) return <div className="p-8 text-sm text-red-500">HISAB not found</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-24">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 bg-white -mx-6 px-6 pt-2 sticky top-0 z-10 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Link href="/dashboard" className="hover:text-primary">HISABs</Link>
                        <span>/</span>
                        <span className="text-gray-900">{cashbook.name}</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {cashbook.name}
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EBEEFD] text-[#4863D4] rounded-full border border-blue-100 uppercase tracking-wider">
                            {userRole}
                        </span>
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex" onClick={generatePDF}>
                        <FileDown className="h-4 w-4 mr-2" />
                        PDF Report
                    </Button>
                </div>
            </div>

            {canViewBalance ? <SummaryCards /> : (
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl text-amber-800 flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Minus className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold">Access Restricted</h4>
                        <p className="text-xs opacity-90">You don't have permission to view the net balance for this book.</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search HISAB..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#4863D4] focus:ring-4 focus:ring-blue-100/50 transition-all bg-white shadow-sm"
                    />
                </div>
                {canAdd && (
                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleOpenModal('IN')}
                            className="bg-[#01865F] hover:bg-[#017050] text-white px-6 h-11 font-bold shadow-md shadow-green-100"
                        >
                            <Plus className="mr-1 h-5 w-5" />
                            CASH IN
                        </Button>
                        <Button
                            onClick={() => handleOpenModal('OUT')}
                            className="bg-[#C93B3B] hover:bg-[#B33535] text-white px-6 h-11 font-bold shadow-md shadow-red-100"
                        >
                            <Minus className="mr-1 h-5 w-5" />
                            CASH OUT
                        </Button>
                    </div>
                )}
            </div>

            <TransactionTable
                transactions={transactions}
                onDelete={canDelete ? deleteTransaction : undefined}
            />

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={transactionType}
            />
        </div>
    );
}

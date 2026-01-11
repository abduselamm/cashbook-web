"use client"

import React, { useState } from 'react';
import { useCashbook } from '@/context/CashbookContext';
import TransactionTable from '@/components/transactions/TransactionTable';
import { SummaryCards } from '@/components/transactions/SummaryCards';
import { Button } from '@/components/ui/Button';
import { Plus, Minus, FileDown, Search } from 'lucide-react'; // Minus for OUT
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CashbookPage() {
    const { cashbook, transactions, deleteTransaction, loading } = useCashbook();
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
            headStyles: { fillColor: [72, 99, 212] }, // Primary Blue
        });

        doc.save(`${cashbook.name}_Report.pdf`);
    };

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
                        <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                            Private
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

            <SummaryCards />

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by remark or amount..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[4px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-white"
                    />
                </div>
                {/* Action Buttons - Top placement for desktop */}
                <div className="flex gap-3">
                    <Button
                        onClick={() => handleOpenModal('IN')}
                        variant="success" // Custom variant
                        className="w-32 font-bold shadow-sm"
                    >
                        <Plus className="mr-1 h-5 w-5" />
                        CASH IN
                    </Button>
                    <Button
                        onClick={() => handleOpenModal('OUT')}
                        variant="destructive"
                        className="w-32 font-bold shadow-sm"
                    >
                        <Minus className="mr-1 h-5 w-5" />
                        CASH OUT
                    </Button>
                </div>
            </div>

            <TransactionTable
                transactions={transactions}
                onDelete={deleteTransaction}
            />

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={transactionType}
            />
        </div>
    );
}

"use client"

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Plus, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { AddCashbookModal } from '@/components/cashbooks/AddCashbookModal';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export default function DashboardPage() {
    const { user, cashbooks, loading } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredCashbooks = cashbooks.filter(book =>
        book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalNetBalance = cashbooks.reduce((sum, book) => sum + (book.stats?.netBalance || 0), 0);

    if (loading) {
        return <div className="p-8 text-sm text-gray-500">Loading...</div>;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[4px] border border-[#EEEEEE] bg-white p-4 flex flex-col justify-center shadow-clean">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Net Balance</p>
                    <p className={`text-2xl font-bold mt-1 ${totalNetBalance >= 0 ? 'text-[#01865F]' : 'text-[#C93B3B]'}`}>
                        {formatCurrency(totalNetBalance)}
                    </p>
                </div>
                <div className="rounded-[4px] border border-[#EEEEEE] bg-white p-4 flex flex-col justify-center shadow-clean">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Books</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">{cashbooks.length}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search cashbooks..."
                        className="pl-9 bg-white border-gray-200 input-clean h-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto font-semibold shadow-none">
                    <Plus className="mr-2 h-4 w-4" />
                    New Cashbook
                </Button>
            </div>

            {/* List View similar to real app */}
            <div className="rounded-[4px] border border-[#EEEEEE] bg-white overflow-hidden shadow-clean">
                <div className="grid grid-cols-12 gap-4 border-b border-[#EEEEEE] bg-[#F9FAFB] px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-6 md:col-span-5">Book Name</div>
                    <div className="hidden md:col-span-3 md:block">Last Updated</div>
                    <div className="col-span-4 md:col-span-3 text-right">Balance</div>
                    <div className="hidden md:col-span-1 md:block"></div>
                </div>

                <div className="divide-y divide-[#EEEEEE]">
                    {filteredCashbooks.length > 0 ? (
                        filteredCashbooks.map((book) => (
                            <Link
                                key={book.id}
                                href={`/dashboard/cashbooks/${book.id}`}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#F9FAFB] transition-colors group"
                            >
                                <div className="col-span-6 md:col-span-5 font-medium text-gray-900 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#EBEEFD] text-[#4863D4] flex items-center justify-center text-xs font-bold border border-blue-100 uppercase">
                                        {book.name.substring(0, 2)}
                                    </div>
                                    <span className="text-sm font-semibold">{book.name}</span>
                                </div>
                                <div className="hidden md:col-span-3 md:block text-xs text-gray-500 font-medium">
                                    {book.lastUpdated ? format(new Date(book.lastUpdated), 'MMM d, h:mm a') : '-'}
                                </div>
                                <div className={`col-span-4 md:col-span-3 text-right font-bold text-sm ${book.stats.netBalance >= 0 ? 'text-[#01865F]' : 'text-[#C93B3B]'}`}>
                                    {formatCurrency(book.stats.netBalance)}
                                </div>
                                <div className="hidden md:col-span-1 md:flex justify-end text-gray-400 group-hover:text-[#4863D4]">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500 text-sm">
                            No cashbooks found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>

            <AddCashbookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

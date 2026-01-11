"use client"

import React from 'react';
import { Transaction } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Trash2, FileText, Calendar, Clock } from 'lucide-react';

interface TransactionTableProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
}

export default function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 bg-white border border-[#EEEEEE] rounded-[4px]">
                <div className="mx-auto h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No transactions yet</h3>
                <p className="text-xs text-gray-500 mt-1">Add your first income or expense.</p>
            </div>
        );
    }

    return (
        <div className="rounded-[4px] border border-[#EEEEEE] bg-white overflow-hidden shadow-clean">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-[#F9FAFB] border-b border-[#EEEEEE]">
                        <tr>
                            <th className="px-6 py-3 font-semibold tracking-wider">Details</th>
                            <th className="px-6 py-3 font-semibold tracking-wider text-right">Cash In (+)</th>
                            <th className="px-6 py-3 font-semibold tracking-wider text-right">Cash Out (-)</th>
                            <th className="px-6 py-3 font-semibold tracking-wider text-right">Balance</th>
                            <th className="px-4 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEEEEE]">
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className="group transition-colors bg-[#EBEEFD] hover:bg-[#DBEAFE] h-[72px]" // Matches extracted colors and height
                            >
                                <td className="px-6 py-3">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 text-sm mb-0.5">{transaction.remark || 'Untitled'}</span>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(transaction.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(transaction.time)}
                                            </span>
                                            {transaction.category && (
                                                <span className="bg-white px-2 py-0.5 rounded border border-blue-100 text-[#4863D4] font-medium">
                                                    {transaction.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    {transaction.type === 'IN' ? (
                                        <span className="font-bold text-[#01865F] text-base">
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    {transaction.type === 'OUT' ? (
                                        <span className="font-bold text-[#C93B3B] text-base">
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-3 text-right font-semibold text-gray-700">
                                    {transaction.balance !== undefined ? formatCurrency(transaction.balance) : '-'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(transaction.id)}
                                        className="h-8 w-8 text-gray-400 hover:text-[#C93B3B] opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

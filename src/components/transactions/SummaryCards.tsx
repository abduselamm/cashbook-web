"use client"

import React from 'react';
import { useCashbook } from '@/context/CashbookContext';
import { getStorage } from '@/lib/storage'; // Should use context? Yes.
import { formatCurrency } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function SummaryCards() {
    const { cashbook } = useCashbook();

    if (!cashbook) return null;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 border-l-4 border-l-success shadow-none bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Cash In</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-success">
                                + {formatCurrency(cashbook.stats.totalIn)}
                            </span>
                        </div>
                    </div>
                    <div className="p-3 bg-success/10 rounded-full">
                        <ArrowDownLeft className="h-5 w-5 text-success" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-danger shadow-none bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Cash Out</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-danger">
                                - {formatCurrency(cashbook.stats.totalOut)}
                            </span>
                        </div>
                    </div>
                    <div className="p-3 bg-danger/10 rounded-full">
                        <ArrowUpRight className="h-5 w-5 text-danger" />
                    </div>
                </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary shadow-none bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Net Balance</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${cashbook.stats.netBalance >= 0 ? 'text-primary' : 'text-danger'}`}>
                                {formatCurrency(cashbook.stats.netBalance)}
                            </span>
                        </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </Card>
        </div>
    );
}

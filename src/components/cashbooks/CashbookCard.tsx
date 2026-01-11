import React from 'react';
import Link from 'next/link';
import { Cashbook } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Users, MoreVertical, Edit, Copy, ChevronRight } from 'lucide-react';

interface CashbookCardProps {
    cashbook: Cashbook;
}

export function CashbookCard({ cashbook }: CashbookCardProps) {
    return (
        <Link href={`/dashboard/cashbooks/${cashbook.id}`} className="group block">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.preventDefault()}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>

                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl text-primary font-bold">
                        {cashbook.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        Updated {formatDate(cashbook.lastUpdated)}
                    </p>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <div className="bg-primary/5 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-500 mb-1">Net Balance</p>
                            <p className={`text-2xl font-bold ${cashbook.stats.netBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                                {formatCurrency(cashbook.stats.netBalance)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Cash In</p>
                                <p className="font-semibold text-success">{formatCurrency(cashbook.stats.totalIn)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Cash Out</p>
                                <p className="font-semibold text-danger">{formatCurrency(cashbook.stats.totalOut)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-2 border-t bg-gray-50/50 flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{cashbook.members.length} Members</span>
                    </div>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                        View <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}

"use client"

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { ChevronDown, Plus, Building2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AddBusinessModal } from '@/components/team/AddBusinessModal';

interface BusinessSwitcherProps {

    isOpen: boolean;
}

export function BusinessSwitcher({ isOpen }: BusinessSwitcherProps) {
    const { business, businesses, switchBusiness, addBusiness } = useApp();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    if (!business) return null;


    return (
        <div className="relative border-b border-[#EEEEEE]">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                    "flex w-full items-center gap-3 px-6 py-4 transition-colors hover:bg-[#F9FAFB]",
                    !isOpen && "justify-center px-4"
                )}
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EBEEFD] text-[#4863D4] border border-blue-100">
                    <Building2 className="h-4 w-4" />
                </div>
                {isOpen && (
                    <div className="flex flex-1 flex-col items-start overflow-hidden text-left">
                        <span className="truncate text-sm font-bold text-gray-900 leading-tight">
                            {business.name}
                        </span>
                        <span className="truncate text-[10px] font-medium text-gray-500 uppercase tracking-tight">
                            {business.type}
                        </span>
                    </div>
                )}
                {isOpen && (
                    <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
                )}
            </button>

            {isDropdownOpen && isOpen && (
                <div className="absolute left-4 right-4 top-full z-[100] mt-1 rounded-xl border border-[#EEEEEE] bg-white p-2 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                    <div className="mb-2 px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        My Businesses
                    </div>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {businesses.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => {
                                    switchBusiness(b.id);
                                    setIsDropdownOpen(false);
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                                    b.id === business.id
                                        ? "bg-[#EBEEFD] text-[#4863D4] font-semibold"
                                        : "text-gray-600 hover:bg-[#F9FAFB]"
                                )}
                            >
                                <span className="truncate pr-2">{b.name}</span>
                                {b.id === business.id && <Check className="h-3.5 w-3.5" />}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 border-t border-[#EEEEEE] pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2 h-9 text-xs font-semibold text-[#4863D4] hover:bg-blue-50"
                            onClick={() => {
                                setIsAddModalOpen(true);
                                setIsDropdownOpen(false);
                            }}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Business
                        </Button>
                    </div>
                </div>
            )}

            <AddBusinessModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}


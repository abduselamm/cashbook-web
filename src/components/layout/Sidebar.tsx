"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Book, Users, Settings, HelpCircle, FileText, ChevronLeft, ChevronRight, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BusinessSwitcher } from './BusinessSwitcher';

const navItems = [
    {
        title: "Main",
        items: [
            {
                title: "HISABs",
                href: "/dashboard",
                icon: Book,
            },
            {
                title: "Reports", // Matches 'Report' in screenshot?
                href: "/dashboard/reports",
                icon: FileText,
            }
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Profile",
                href: "/dashboard/profile",
                icon: User,
            },
            {
                title: "Team Settings",
                href: "/dashboard/team",
                icon: Users,
            },
            {
                title: "Business Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];

import { useApp } from '@/context/AppContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isMobile: boolean;
}

export function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
    const pathname = usePathname();
    const { business, user } = useApp();


    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-white border-r border-[#EEEEEE] transition-all duration-300 ease-in-out shadow-sm",
                    isOpen ? "w-64" : "w-[70px]",
                    isMobile && !isOpen && "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center px-6 border-b border-[#EEEEEE]">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary overflow-hidden whitespace-nowrap">
                        <span className={cn("transition-opacity duration-300 text-[#4863D4]", !isOpen && "hidden")}>
                            HISAB
                        </span>
                        {!isOpen && <span className="text-[#4863D4]">H</span>}
                    </Link>
                </div>

                <BusinessSwitcher isOpen={isOpen} />

                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="grid gap-8 px-4">
                        {(() => {
                            const currentMember = business?.members.find((m: any) => m.id === user?.id);
                            const role = currentMember?.role || 'STAFF';

                            return navItems.map((section, index) => {
                                // Filter items based on role
                                let filteredItems = section.items;
                                if (section.title === 'Settings' && role === 'STAFF') {
                                    // Staff can only see Profile, not Team or Business Settings
                                    filteredItems = section.items.filter(item => item.href === '/dashboard/profile');
                                }

                                // Don't show section if no items left after filtering
                                if (filteredItems.length === 0) return null;

                                return (
                                    <div key={index}>
                                        {isOpen && section.title !== 'Main' && (
                                            <h3 className="mb-3 px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                                                {section.title}
                                            </h3>
                                        )}
                                        <div className="grid gap-1">
                                            {filteredItems.map((item, itemIndex) => {
                                                const Icon = item.icon;
                                                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                                                return (
                                                    <Link
                                                        key={itemIndex}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm font-medium transition-colors",
                                                            isActive
                                                                ? "bg-[#4863D4] text-white shadow-sm"
                                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                            !isOpen && "justify-center px-2"
                                                        )}
                                                        title={!isOpen ? item.title : undefined}
                                                    >
                                                        <Icon className={cn("h-5 w-5", !isOpen && "h-6 w-6")} strokeWidth={isActive ? 2 : 1.5} />
                                                        {isOpen && <span>{item.title}</span>}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </nav>
                </div>



                <div className="p-4 border-t border-[#EEEEEE]">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-500 hover:text-primary gap-2"
                        onClick={() => { }}
                    >
                        <HelpCircle className="h-4 w-4" />
                        {isOpen && "Help & Support"}
                    </Button>
                </div>
            </div>
        </>
    );
}

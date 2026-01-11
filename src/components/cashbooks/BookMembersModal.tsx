"use client"

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BookRole, Cashbook, OperatorPermissions, User } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Users, Shield, Eye, Keyboard, ChevronRight, Check, X, Settings2 } from 'lucide-react';

interface BookMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    cashbook: Cashbook;
}

export function BookMembersModal({ isOpen, onClose, cashbook }: BookMembersModalProps) {
    const { business, updateBookMember } = useApp();
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

    if (!business) return null;

    const roles: { id: BookRole; title: string, icon: any, desc: string }[] = [
        { id: 'ADMIN', title: 'Admin', icon: Shield, desc: 'Full control of this book' },
        { id: 'OPERATOR', title: 'Data Operator', icon: Keyboard, desc: 'Can add and edit entries' },
        { id: 'VIEWER', title: 'Viewer', icon: Eye, desc: 'Read-only access' }
    ];

    const handleRoleChange = (memberId: string, role: BookRole) => {
        const member = business.members.find(m => m.id === memberId);
        if (!member) return;

        const defaultPermissions: OperatorPermissions = {
            canEditEntries: true,
            canAddBackdatedEntries: false,
            canViewNetBalance: true,
            canViewOtherEntries: true
        };

        updateBookMember(cashbook.id, memberId, role, role === 'OPERATOR' ? defaultPermissions : undefined);
    };

    const togglePermission = (memberId: string, key: keyof OperatorPermissions) => {
        const member = cashbook.bookMembers.find(m => m.id === memberId);
        if (!member || !member.permissions) return;

        const updatedPermissions = {
            ...member.permissions,
            [key]: !member.permissions[key]
        };

        updateBookMember(cashbook.id, memberId, member.bookRole, updatedPermissions);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage Members - ${cashbook.name}`} className="max-w-2xl">
            <div className="space-y-6">

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center text-[#4863D4] shadow-sm">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Book Level Access</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Control who can see or edit data in this specific HISAB.
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl bg-white overflow-hidden">
                    {business.members.map((businessMember) => {
                        const bookMember = cashbook.bookMembers.find(m => m.id === businessMember.id);
                        const isEditing = editingMemberId === businessMember.id;

                        return (
                            <div key={businessMember.id} className="p-4 transition-colors hover:bg-gray-50/50">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {businessMember.avatar ? (
                                                <img src={businessMember.avatar} alt={businessMember.name} className="h-full w-full rounded-full" />
                                            ) : (
                                                businessMember.name.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-900">{businessMember.name}</span>
                                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                    {businessMember.role}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">{businessMember.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {bookMember ? (
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                                                    bookMember.bookRole === 'ADMIN' ? "bg-red-50 text-red-600 border-red-100" :
                                                        bookMember.bookRole === 'OPERATOR' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                            "bg-gray-50 text-gray-600 border-gray-200"
                                                )}>
                                                    {bookMember.bookRole}
                                                </span>
                                                <button
                                                    onClick={() => setEditingMemberId(isEditing ? null : businessMember.id)}
                                                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"
                                                >
                                                    <Settings2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRoleChange(businessMember.id, 'VIEWER')}
                                                className="text-xs font-bold text-[#4863D4] h-8 px-3"
                                            >
                                                Add to Book
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {isEditing && bookMember && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {roles.map((r) => {
                                                const Icon = r.icon;
                                                return (
                                                    <button
                                                        key={r.id}
                                                        onClick={() => handleRoleChange(businessMember.id, r.id)}
                                                        className={cn(
                                                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                                                            bookMember.bookRole === r.id
                                                                ? "border-[#4863D4] bg-blue-50/50"
                                                                : "border-gray-100 hover:border-gray-200 bg-white"
                                                        )}
                                                    >
                                                        <Icon className={cn("h-4 w-4", bookMember.bookRole === r.id ? "text-[#4863D4]" : "text-gray-400")} />
                                                        <span className={cn("text-[10px] font-bold", bookMember.bookRole === r.id ? "text-gray-900" : "text-gray-500")}>
                                                            {r.title}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {bookMember.bookRole === 'OPERATOR' && bookMember.permissions && (
                                            <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Permissions</div>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                    {Object.entries(bookMember.permissions).map(([key, value]) => (
                                                        <button
                                                            key={key}
                                                            onClick={() => togglePermission(businessMember.id, key as keyof OperatorPermissions)}
                                                            className="flex items-center gap-2 group"
                                                        >
                                                            <div className={cn(
                                                                "h-4 w-4 rounded flex items-center justify-center border transition-colors",
                                                                value ? "bg-[#4863D4] border-[#4863D4]" : "bg-white border-gray-300"
                                                            )}>
                                                                {value && <Check className="h-2.5 w-2.5 text-white" />}
                                                            </div>
                                                            <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900 capitalize">
                                                                {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={onClose} className="font-bold min-w-[120px]">
                        Done
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

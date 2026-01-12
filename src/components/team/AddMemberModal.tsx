"use client"

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Role } from '@/types';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { UserPlus, Shield, User, Users } from 'lucide-react';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    const { inviteMember, business } = useApp();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('STAFF');

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            inviteMember(email, role);
            setEmail('');
            setRole('STAFF');
            onClose();
        }
    };

    const roles = [
        {
            id: 'PARTNER' as Role,
            title: 'Partner',
            description: 'Can manage all books and members. Cannot delete business.',
            icon: Shield,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            id: 'STAFF' as Role,
            title: 'Staff',
            description: 'Can only see books they are invited to. No business settings access.',
            icon: User,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member">
            <form onSubmit={handleInvite} className="space-y-6">
                {/* Business Context Display */}
                {business && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center text-[#4863D4] shadow-sm">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Inviting to Business</h4>
                            <p className="text-xs text-gray-600 mt-0.5">
                                Member will be added to <span className="font-bold">{business.name}</span>
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <Input
                        type="email"
                        placeholder="e.g. member@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 shadow-none border-gray-200 focus:border-primary"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">Select Role</label>
                    <div className="grid gap-3">
                        {roles.map((r) => {
                            const Icon = r.icon;
                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setRole(r.id)}
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                                        role === r.id
                                            ? "border-[#4863D4] bg-blue-50/50"
                                            : "border-gray-100 hover:border-gray-200 bg-white"
                                    )}
                                >
                                    <div className={cn("mt-1 p-2 rounded-lg", r.bg, r.color)}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-gray-900">{r.title}</span>
                                            {role === r.id && (
                                                <div className="h-4 w-4 rounded-full border-4 border-[#4863D4] bg-white" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            {r.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-11 font-bold text-gray-500 hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 h-11 font-bold shadow-md shadow-blue-100"
                    >
                        Send Invitation
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

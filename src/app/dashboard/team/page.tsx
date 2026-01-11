"use client"

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { UserPlus, Shield, User, MoreVertical, Mail, Calendar } from 'lucide-react';
import { AddMemberModal } from '@/components/team/AddMemberModal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function TeamPage() {
    const { business, updateMemberRole } = useApp();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    if (!business) return null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEEEEE] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage roles and permissions for {business.name}
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="font-bold shadow-md shadow-blue-100"
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                </Button>
            </div>

            <div className="grid gap-4">
                {business.members.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white border border-[#EEEEEE] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-clean transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-[#EBEEFD] text-[#4863D4] flex items-center justify-center text-sm font-bold border border-blue-50">
                                {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    member.name.substring(0, 2).toUpperCase()
                                )}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">{member.name}</span>
                                    {member.status === 'INVITED' && (
                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-100">
                                            Invited
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {member.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                            <div className="flex flex-col items-end mr-4">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                                    member.role === 'OWNER' ? "bg-red-50 text-red-600" :
                                        member.role === 'PARTNER' ? "bg-purple-50 text-purple-600" :
                                            "bg-blue-50 text-blue-600"
                                )}>
                                    {member.role}
                                </span>
                            </div>

                            {member.role !== 'OWNER' && (
                                <select
                                    className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 font-medium text-gray-600 focus:ring-0 cursor-pointer hover:bg-gray-100"
                                    value={member.role}
                                    onChange={(e) => updateMemberRole(member.id, e.target.value as any)}
                                >
                                    <option value="PARTNER">Partner</option>
                                    <option value="STAFF">Staff</option>
                                </select>
                            )}

                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}


"use client"

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User as UserIcon, Mail, Phone, Camera, Save } from 'lucide-react';

export default function ProfilePage() {
    const { user, setUser } = useApp() as any;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleSave = () => {
        if (user) {
            const updatedUser = {
                ...user,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            };
            setUser(updatedUser);
            setIsEditing(false);
            alert('Profile updated successfully!');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        });
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="p-8 text-center text-gray-500">
                Please sign in to view your profile.
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto pb-24">
            {/* Header */}
            <div className="border-b border-[#EEEEEE] pb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your personal information and preferences
                </p>
            </div>

            {/* Profile Avatar Section */}
            <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-clean">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-[#EBEEFD] text-[#4863D4] flex items-center justify-center text-2xl font-bold border-2 border-blue-100 overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                user.name.substring(0, 2).toUpperCase()
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-[#4863D4] text-white rounded-full flex items-center justify-center hover:bg-[#3952B8] transition-colors shadow-md">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Profile Information Form */}
            <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-clean">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            size="sm"
                            className="font-bold"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            Full Name
                        </label>
                        {isEditing ? (
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-11 shadow-none border-gray-200 focus:border-[#4863D4]"
                                placeholder="Enter your full name"
                            />
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {user.name}
                            </div>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            Email Address
                        </label>
                        {isEditing ? (
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-11 shadow-none border-gray-200 focus:border-[#4863D4]"
                                placeholder="Enter your email"
                            />
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {user.email}
                            </div>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            Phone Number
                        </label>
                        {isEditing ? (
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-11 shadow-none border-gray-200 focus:border-[#4863D4]"
                                placeholder="Enter your phone number"
                            />
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {user.phone || 'Not provided'}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={handleCancel}
                                className="flex-1 h-11 font-bold text-gray-500 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-1 h-11 font-bold shadow-md shadow-blue-100"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-clean">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">User ID</span>
                        <span className="font-mono text-gray-900">{user.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Account Type</span>
                        <span className="font-bold text-[#4863D4]">HISAB User</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

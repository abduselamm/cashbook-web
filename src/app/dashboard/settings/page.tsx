"use client"

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building2, MapPin, Users, Briefcase, Save, Factory } from 'lucide-react';
import { format } from 'date-fns';

export default function SettingsPage() {
    const { business, updateBusiness } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: business?.name || '',
        category: business?.category || '',
        industry: business?.industry || '',
        type: business?.type || '',
        staffSize: business?.staffSize || '',
        address: business?.address || '',
    });

    const handleSave = () => {
        if (business) {
            updateBusiness(formData);
            setIsEditing(false);
            alert('Business settings updated successfully!');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: business?.name || '',
            category: business?.category || '',
            industry: business?.industry || '',
            type: business?.type || '',
            staffSize: business?.staffSize || '',
            address: business?.address || '',
        });
        setIsEditing(false);
    };

    if (!business) {
        return (
            <div className="p-8 text-center text-gray-500">
                No business selected. Please select or create a business first.
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto pb-24">
            {/* Header */}
            <div className="border-b border-[#EEEEEE] pb-6">
                <h1 className="text-2xl font-bold text-gray-900">Business Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your business profile and information
                </p>
            </div>

            {/* Business Profile Section */}
            <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-clean">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-[#EBEEFD] text-[#4863D4] flex items-center justify-center text-2xl font-bold border-2 border-blue-100 overflow-hidden">
                            <Building2 className="h-12 w-12" />
                        </div>
                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-[#4863D4] text-white rounded-full flex items-center justify-center hover:bg-[#3952B8] transition-colors shadow-md">
                            <Factory className="h-4 w-4" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-500">{business.industry} • {business.type}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Created on {format(new Date(business.createdAt), 'MMM d, yyyy')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Business Information Form */}
            <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-clean">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Business Information</h2>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            size="sm"
                            className="font-bold"
                        >
                            Edit Settings
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {/* Business Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            Business Name
                        </label>
                        {isEditing ? (
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-11 shadow-none border-gray-200 focus:border-[#4863D4]"
                                placeholder="Enter business name"
                            />
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {business.name}
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            Category
                        </label>
                        {isEditing ? (
                            <Input
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="h-11 shadow-none border-gray-200 focus:border-[#4863D4]"
                                placeholder="e.g., Technology, Retail"
                            />
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {business.category}
                            </div>
                        )}
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Factory className="h-4 w-4 text-gray-400" />
                            Industry
                        </label>
                        {isEditing ? (
                            <select
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                className="h-11 w-full px-4 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:border-[#4863D4] focus:ring-0 focus:outline-none"
                            >
                                <option value="">Select Industry</option>
                                <option value="retail">Retail / Shop</option>
                                <option value="construction">Construction</option>
                                <option value="education">Education</option>
                                <option value="electronics">Electronics</option>
                                <option value="food">Food / Restaurant</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="transport">Transport</option>
                                <option value="jewellery">Jewellery</option>
                                <option value="other">Other</option>
                            </select>
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium capitalize">
                                {business.industry}
                            </div>
                        )}
                    </div>

                    {/* Business Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            Business Type
                        </label>
                        {isEditing ? (
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="h-11 w-full px-4 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:border-[#4863D4] focus:ring-0 focus:outline-none"
                            >
                                <option value="">Select Type</option>
                                <option value="Retailer">Retailer</option>
                                <option value="Distributor">Distributor</option>
                                <option value="Manufacturer">Manufacturer</option>
                                <option value="Service Provider">Service Provider</option>
                                <option value="Trader">Trader</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {business.type}
                            </div>
                        )}
                    </div>

                    {/* Staff Size */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            Staff Size
                        </label>
                        {isEditing ? (
                            <select
                                value={formData.staffSize}
                                onChange={(e) => setFormData({ ...formData, staffSize: e.target.value })}
                                className="h-11 w-full px-4 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:border-[#4863D4] focus:ring-0 focus:outline-none"
                            >
                                <option value="">Select Size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                        ) : (
                            <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {business.staffSize}
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            Business Address
                        </label>
                        {isEditing ? (
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:border-[#4863D4] focus:ring-0 focus:outline-none resize-none"
                                rows={3}
                                placeholder="Enter business address"
                            />
                        ) : (
                            <div className="min-h-[88px] flex items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                                {business.address || 'Not provided'}
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

            {/* Business Stats */}
            <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-clean">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Business Statistics</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Members</p>
                        <p className="text-2xl font-bold text-[#4863D4]">{business.members.length}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Owner</p>
                        <p className="text-sm font-bold text-purple-600">
                            {business.members.find(m => m.role === 'OWNER')?.name || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

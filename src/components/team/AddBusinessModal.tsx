"use client"

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
    Building2,
    Briefcase,
    ChevronRight,
    Check,
    Store,
    Truck,
    Factory,
    GraduationCap,
    Utensils,
    HardHat,
    Cpu,
    HeartPulse,
    Gem,
    Lightbulb
} from 'lucide-react';

interface AddBusinessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const industries = [
    { id: 'retail', name: 'Retail / Shop', icon: Store },
    { id: 'construction', name: 'Construction', icon: HardHat },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'electronics', name: 'Electronics', icon: Cpu },
    { id: 'food', name: 'Food / Restaurant', icon: Utensils },
    { id: 'manufacturing', name: 'Manufacturing', icon: Factory },
    { id: 'healthcare', name: 'Healthcare', icon: HeartPulse },
    { id: 'transport', name: 'Transport', icon: Truck },
    { id: 'jewellery', name: 'Jewellery', icon: Gem },
    { id: 'other', name: 'Other', icon: Lightbulb },
];

const businessTypes = [
    { id: 'Retailer', name: 'Retailer' },
    { id: 'Distributor', name: 'Distributor' },
    { id: 'Manufacturer', name: 'Manufacturer' },
    { id: 'Service Provider', name: 'Service Provider' },
    { id: 'Trader', name: 'Trader' },
    { id: 'Other', name: 'Other' },
];

export function AddBusinessModal({ isOpen, onClose }: AddBusinessModalProps) {
    const { addBusiness } = useApp();
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('retail');
    const [type, setType] = useState('Retailer');
    const [step, setStep] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            // Mapping existing addBusiness to handle more fields if needed, 
            // but for now keeping it simple or augmenting it.
            addBusiness(name);
            // Reset and close
            setName('');
            setStep(1);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Business"
            className="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Business Name</label>
                            <Input
                                placeholder="e.g. Acme Corporation"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-12 shadow-none border-gray-200 focus:border-[#4863D4] text-lg font-medium"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">Select Industry</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {industries.map((ind) => {
                                    const Icon = ind.icon;
                                    return (
                                        <button
                                            key={ind.id}
                                            type="button"
                                            onClick={() => setIndustry(ind.id)}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all group",
                                                industry === ind.id
                                                    ? "border-[#4863D4] bg-blue-50/50"
                                                    : "border-gray-50 bg-white hover:border-gray-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-2 rounded-lg transition-colors",
                                                industry === ind.id ? "bg-[#4863D4] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className={cn(
                                                "text-[11px] font-bold text-center",
                                                industry === ind.id ? "text-[#4863D4]" : "text-gray-600"
                                            )}>
                                                {ind.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="button"
                                className="w-full h-12 font-bold text-lg"
                                disabled={!name}
                                onClick={() => setStep(2)}
                            >
                                Next
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">Business Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {businessTypes.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setType(t.id)}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all",
                                            type === t.id
                                                ? "border-[#4863D4] bg-blue-50/50 text-[#4863D4]"
                                                : "border-gray-50 bg-white hover:border-gray-200 text-gray-600"
                                        )}
                                    >
                                        <span className="font-bold">{t.name}</span>
                                        {type === t.id && <Check className="h-5 w-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="flex-1 h-12 font-bold text-gray-500"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="flex-[2] h-12 font-bold text-lg shadow-lg shadow-blue-100"
                            >
                                Create Business
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
}

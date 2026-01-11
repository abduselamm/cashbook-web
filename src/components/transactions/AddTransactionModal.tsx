"use client"

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCashbook } from '@/context/CashbookContext';
import { PaymentMode } from '@/types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'IN' | 'OUT';
}

const CATEGORIES = [
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Salary', value: 'Salary' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Other', value: 'Other' },
];

const MODES: { label: string, value: PaymentMode }[] = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Online', value: 'Online' },
    { label: 'Bank Transfer', value: 'Bank' },
    { label: 'UPI', value: 'UPI' },
];

export function AddTransactionModal({ isOpen, onClose, type }: AddTransactionModalProps) {
    const { addTransaction } = useCashbook();
    const [amount, setAmount] = useState('');
    const [remark, setRemark] = useState('');
    const [category, setCategory] = useState('Other');
    const [mode, setMode] = useState<PaymentMode>('Cash');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setRemark('');
            setCategory('Other');
            setMode('Cash');
            const now = new Date();
            setDate(now.toISOString().split('T')[0]);
            // Format time as HH:MM
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        // Evaluate simple expressions for amount
        let finalAmount = 0;
        try {
            // Very basic safety check, ensuring only numbers and operators
            if (/^[0-9+\-*/. ()]+$/.test(amount)) {
                // eslint-disable-next-line no-new-func
                finalAmount = new Function(`return ${amount}`)();
            } else {
                finalAmount = parseFloat(amount);
            }
        } catch {
            finalAmount = parseFloat(amount);
        }

        if (isNaN(finalAmount)) return;

        // Convert time input to AM/PM string for display
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const timeStr = `${hour12}:${m} ${ampm}`;

        addTransaction({
            amount: finalAmount,
            type,
            remark,
            category,
            paymentMode: mode,
            date: new Date(date).toISOString(),
            time: timeStr
        });

        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={type === 'IN' ? 'Add Cash In (Income)' : 'Add Cash Out (Expense)'}
            className={type === 'IN' ? 'border-t-4 border-t-success' : 'border-t-4 border-t-danger'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Date</label>
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Time</label>
                        <Input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Amount (Supports calculation e.g. 100+50)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">ETB</span>
                        <Input
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className={`pl-12 text-lg font-semibold ${type === 'IN' ? 'text-success' : 'text-danger'}`}
                            placeholder="0.00"
                            autoFocus
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Remark</label>
                    <Input
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                        placeholder="What is this for?"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Category</label>
                        <Select
                            options={CATEGORIES}
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Payment Mode</label>
                        <Select
                            options={MODES}
                            value={mode}
                            onChange={e => setMode(e.target.value as PaymentMode)}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        className={type === 'IN' ? 'bg-success hover:bg-success/90' : 'bg-danger hover:bg-danger/90'}
                    >
                        Save {type === 'IN' ? 'Income' : 'Expense'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

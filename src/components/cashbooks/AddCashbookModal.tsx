"use client"

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';

interface AddCashbookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCashbookModal({ isOpen, onClose }: AddCashbookModalProps) {
    const { addCashbook } = useApp();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        // Simulate delay
        setTimeout(() => {
            addCashbook(name);
            setLoading(false);
            setName('');
            onClose();
        }, 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New HISAB">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">HISAB Name</label>
                    <Input
                        id="name"
                        placeholder="e.g. Office Expenses, Project A, Daily Sales"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                    />
                    <p className="text-xs text-muted-foreground text-gray-500">
                        Give your cashbook a recognizable name to easily identify it later.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!name.trim() || loading} isLoading={loading}>
                        Create HISAB
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

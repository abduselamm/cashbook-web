"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Loader2, Building2, UserPlus } from 'lucide-react';

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const { user, businesses, setBusinesses, setBusiness, joinBusiness } = useApp() as any;

    const [inviteData, setInviteData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const token = params.id as string;
            const decoded = JSON.parse(atob(token));

            if (decoded.expires < Date.now()) {
                setError("This invitation has expired.");
            } else {
                setInviteData(decoded);
            }
        } catch (e) {
            setError("Invalid invitation link.");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    const handleAccept = async () => {
        if (!user) {
            router.push(`/api/auth/signin?callbackUrl=${window.location.href}`);
            return;
        }

        setAccepting(true);
        try {
            // Call the joinBusiness function from AppContext
            joinBusiness(inviteData.businessId, inviteData.role);

            // Wait a bit for effect
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`Successfully joined ${inviteData.businessName}!`);
            router.push('/dashboard');
        } catch (e) {
            alert("Failed to join business. Please try again.");
        } finally {
            setAccepting(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#4863D4]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-red-100 text-center">
                    <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8" style={{ transform: 'rotate(45deg)' }} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Invitation Error</h1>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Button onClick={() => router.push('/')} className="w-full">
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all hover:scale-[1.01]">
                <div className="bg-[#4863D4] p-8 text-white text-center">
                    <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                        <UserPlus className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">You're Invited!</h1>
                    <p className="opacity-90 text-sm mt-1">Join a business on HISAB</p>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 shrink-0">
                                <Building2 className="h-6 w-6 text-[#4863D4]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Business</p>
                                <p className="font-bold text-gray-900">{inviteData.businessName || 'Business Name'}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <p className="text-sm text-blue-800 leading-relaxed text-center">
                                You've been invited to join this business as a <span className="font-bold uppercase">{inviteData.role}</span>.
                            </p>
                        </div>

                        {!user && (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm text-center">
                                You need to sign in to accept this invitation.
                            </div>
                        )}

                        <Button
                            onClick={handleAccept}
                            className="w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-blue-200"
                            isLoading={accepting}
                        >
                            {user ? 'Accept & Join Business' : 'Sign in to Accept'}
                        </Button>

                        <p className="text-center text-xs text-gray-400">
                            By joining, you agree to the Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

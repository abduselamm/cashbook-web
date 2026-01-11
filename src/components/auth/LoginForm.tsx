"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Phone } from 'lucide-react';
import { signIn } from 'next-auth/react';

export function LoginForm() {
    const router = useRouter();
    const { login } = useApp();
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState<'email' | 'phone'>('email');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            login(); // Set mock user
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (error) {
            console.error("Login failed", error);
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Sign in to CashBook</h1>
                <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
            </div>

            <div className="space-y-4">
                <Button
                    className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    isLoading={loading}
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Continue with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground bg-white text-gray-500">
                            Or continue with {method}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        {method === 'email' ? (
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Enter your mobile number"
                                    type="tel"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Continue
                    </Button>
                </form>

                <div className="text-center space-y-2">
                    <button
                        type="button"
                        onClick={() => setMethod(method === 'email' ? 'phone' : 'email')}
                        className="text-sm text-primary hover:underline"
                    >
                        Use {method === 'email' ? 'Phone Number' : 'Email Address'} instead
                    </button>
                </div>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground text-gray-500">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </a>
                .
            </p>
        </div>
    );
}

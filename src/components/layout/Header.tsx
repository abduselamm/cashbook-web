import React from 'react';
import { Button } from '@/components/ui/Button';
import { Bell, LogOut, Menu, User as UserIcon, Cloud, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface HeaderProps {
    toggleSidebar: () => void;
    isMobile: boolean;
}

export function Header({ toggleSidebar, isMobile }: HeaderProps) {
    const { user, business, logout, syncStatus } = useApp();
    const router = useRouter();
    const [showProfile, setShowProfile] = React.useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
            <div className="flex items-center gap-4">
                {isMobile && (
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        <Menu className="h-6 w-6" />
                    </Button>
                )}
                <div className="hidden md:flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                        {business?.name || 'My Business'}
                    </h1>
                    <span className="text-xs text-muted-foreground">
                        {business?.category || 'General'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Sync Status Indicator */}
                <div className="hidden md:flex items-center gap-2 mr-2 text-xs text-muted-foreground">
                    {syncStatus === 'syncing' && (
                        <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Syncing...</span>
                        </>
                    )}
                    {syncStatus === 'saved' && (
                        <>
                            <Cloud className="h-3 w-3 text-success" />
                            <span className="text-success">Saved</span>
                        </>
                    )}
                    {syncStatus === 'error' && (
                        <span className="text-danger font-medium">Sync Error</span>
                    )}
                </div>

                <Button variant="ghost" size="icon" className="text-gray-500">
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors outline-none"
                    >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <UserIcon className="h-4 w-4 text-primary" />
                            )}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{user?.role || 'User'}</p>
                        </div>
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md bg-white p-2 shadow-lg border animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-2 py-1.5 border-b mb-1 md:hidden">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-danger hover:bg-danger/10 hover:text-danger"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

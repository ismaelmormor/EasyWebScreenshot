'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera } from 'lucide-react';
import clsx from 'clsx';

export function Header() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white">
                        <Camera size={16} className="text-white" />
                    </div>
                    <Link href="/" className="font-semibold tracking-tight text-sm text-slate-900">
                        Easy Web Screenshot
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/docs"
                        className={clsx(
                            "text-sm transition-colors",
                            isActive('/docs') ? "font-medium text-slate-900" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Docs
                    </Link>
                    <Link
                        href="/pricing"
                        className={clsx(
                            "text-sm transition-colors",
                            isActive('/pricing') ? "font-medium text-slate-900" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="#" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900">Sign in</Link>
                    <Link href="#" className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                        Get API Key
                    </Link>
                </div>
            </div>
        </header>
    );
}

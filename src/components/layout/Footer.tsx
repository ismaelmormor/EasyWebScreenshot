import Link from 'next/link';
import { Camera } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center text-white">
                        <Camera size={12} className="text-white" />
                    </div>
                    <span className="font-semibold text-sm text-slate-900 tracking-tight">Easy Web Screenshot</span>
                </div>

                <div className="flex gap-8 text-sm text-slate-500">
                    <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Twitter</Link>
                </div>

                <p className="text-xs text-slate-400">
                    © 2024 Easy Web Screenshot. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

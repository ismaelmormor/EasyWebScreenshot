'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    CreditCard,
    BarChart2,
    Key,
    Lock,
    Eye,
    EyeOff,
    Copy,
    CheckCircle,
    RotateCcw,
    ArrowRight,
    Globe,
    AlertCircle,
    MoreHorizontal,
    LogOut,
    User as UserIcon
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface DashboardProps {
    user: User;
    signOut: () => Promise<void>;
    plan: string;
    credits: number;
    usage: number;
    apiKey: string | null;
}

export default function Dashboard({ user, signOut, plan, credits, usage, apiKey }: DashboardProps) {
    const [copied, setCopied] = useState(false);


    const handleCopy = async () => {
        if (!apiKey) return;
        try {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const usagePercentage = Math.min(Math.round((usage / credits) * 100), 100);

    return (
        <main className="max-w-7xl mx-auto px-6 py-10 w-full animate-in fade-in duration-500">

            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your API keys and subscription usage.</p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-mono">Environment: Production</span>
                    <form action={async () => { await signOut(); }}>
                        <button className="text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors">
                            <LogOut size={12} /> Sign Out
                        </button>
                    </form>
                </div>
            </div>



            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* Subscription Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CreditCard size={22} />
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Active
                            </span>
                        </div>
                        <h3 className="text-base font-medium text-slate-900 capitalize">{plan} Plan</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                            {/* Placeholder pricing logic */}
                            <span className="text-2xl font-semibold text-slate-900 tracking-tight">
                                {plan === 'free' ? '$0' : '$9'}
                            </span>
                            <span className="text-sm text-slate-500">/month</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                            Manage Subscription
                        </button>
                    </div>
                </div>

                {/* Usage Quota Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <BarChart2 size={22} />
                            </div>
                            <span className="text-xs font-medium text-slate-500">
                                Resets next month
                            </span>
                        </div>

                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-base font-medium text-slate-900">API Usage</h3>
                            <span className="text-sm font-medium text-indigo-600">{usagePercentage}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${usagePercentage}%` }}
                            ></div>
                        </div>

                        <p className="text-xs text-slate-500">
                            <span className="font-medium text-slate-700">{usage}</span> of {credits} requests used
                        </p>
                    </div>
                    <div className="mt-6">
                        <button className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                            View Usage Report
                        </button>
                    </div>
                </div>

                {/* API Key Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow relative overflow-hidden">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Key size={22} />
                            </div>
                            <h3 className="text-base font-medium text-slate-900">Your API Key</h3>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={16} />
                            </div>
                            <code
                                className="block w-full pl-9 pr-12 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 bg-slate-50 flex items-center overflow-hidden"
                            >
                                {apiKey
                                    ? <span className="tracking-wider">{apiKey.slice(0, 12)}••••••••••••••••{apiKey.slice(-4)}</span>
                                    : 'No API Key Generated'
                                }
                            </code>

                            <div className="absolute inset-y-0 right-0 flex items-center pr-1 gap-1">
                                <button
                                    onClick={handleCopy}
                                    className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors ${copied ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-slate-600'}`}
                                    title="Copy to Clipboard"
                                    disabled={!apiKey}
                                >
                                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Never share your key with client-side code.</p>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <RotateCcw size={14} />
                            Roll Key
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section - Placeholder Data */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-medium text-slate-900">Recent Requests</h3>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
                        View All <ArrowRight size={14} />
                    </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3 border-b border-slate-100 w-1/4">Timestamp</th>
                                <th className="px-6 py-3 border-b border-slate-100 w-1/3">Target URL</th>
                                <th className="px-6 py-3 border-b border-slate-100">Status</th>
                                <th className="px-6 py-3 border-b border-slate-100">Latency</th>
                                <th className="px-6 py-3 border-b border-slate-100 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Placeholder Row 1 */}
                            <tr className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-3.5 text-slate-500 font-mono text-xs">Recently</td>
                                <td className="px-6 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                                            <Globe size={12} />
                                        </div>
                                        <span className="text-slate-700 font-medium truncate max-w-[200px]">example.com</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                                        <AlertCircle size={12} /> Pending Data Integration
                                    </span>
                                </td>
                                <td className="px-6 py-3.5 text-slate-500 font-mono text-xs">-</td>
                                <td className="px-6 py-3.5 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </main>
    );
}

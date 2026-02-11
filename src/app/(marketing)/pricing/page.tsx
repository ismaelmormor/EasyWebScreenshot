'use client';

import { useState } from 'react';
import { CheckCircle, Star, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { createCheckoutSession } from '@/modules/stripe/actions';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const prices = {
        hobby: 0,
        pro: billingCycle === 'monthly' ? 9 : 7,
        business: billingCycle === 'monthly' ? 49 : 39
    };

    return (
        <main className="pt-32 pb-20 flex-grow">

            {/* Pricing Hero */}
            <section className="max-w-4xl mx-auto px-6 text-center mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -z-10 opacity-60"></div>

                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
                    Simple, transparent pricing. <br />
                    <span className="text-slate-400">No hidden fees.</span>
                </h1>

                <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                    Start for free, upgrade when you need more power. All plans include our core rendering engine.
                </p>

                {/* Toggle */}
                <div className="inline-flex bg-white border border-slate-200 p-1 rounded-full relative mb-12 shadow-sm">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={clsx(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all",
                            billingCycle === 'monthly' ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={clsx(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                            billingCycle === 'yearly' ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Yearly <span className={clsx("text-[10px] px-2 py-0.5 rounded-full border", billingCycle === 'yearly' ? "text-emerald-300 bg-emerald-900/30 border-emerald-800" : "text-emerald-600 bg-emerald-50 border-emerald-100")}>Save 20%</span>
                    </button>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Hobby Plan */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-slate-900 mb-2">Hobby</h3>
                            <p className="text-sm text-slate-500">Perfect for testing and personal projects.</p>
                        </div>
                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-4xl font-semibold tracking-tight text-slate-900">${prices.hobby}</span>
                            <span className="text-slate-400 text-sm">/mo</span>
                        </div>
                        <Link href="#" className="block w-full py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium text-center hover:bg-slate-50 hover:border-slate-300 transition-all mb-8">
                            Start for Free
                        </Link>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                50 Screenshots / month
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                Standard Quality (1080p)
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                Basic Cookie Blocking
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                1 Concurrent Request
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                Community Support
                            </li>
                        </ul>
                    </div>

                    {/* Pro Plan (Highlighted) */}
                    <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 shadow-2xl shadow-blue-900/10 scale-100 md:scale-105 relative z-10 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full border-4 border-slate-50">
                            Most Popular
                        </div>

                        <div className="mb-6 mt-2">
                            <h3 className="text-lg font-medium text-slate-900 mb-2 flex items-center gap-2">
                                Pro
                                <Star className="text-blue-500 fill-blue-500" size={14} />
                            </h3>
                            <p className="text-sm text-slate-500">For freelancers and growing apps.</p>
                        </div>
                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-4xl font-semibold tracking-tight text-slate-900">${prices.pro}</span>
                            <span className="text-slate-400 text-sm">/mo</span>
                        </div>
                        <form action={async () => {
                            await createCheckoutSession('price_1SzciZLH9nOoVyuzkOLl7pDn');
                        }}>
                            <button type="submit" className="block w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium text-center hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all mb-8">
                                Get Pro API Key
                            </button>
                        </form>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-slate-900 font-medium">
                                <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                                5,000 Screenshots / month
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700">
                                <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                                Smart Anti-Cookie Wall
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700">
                                <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                                Full Page Screenshots
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700">
                                <CheckCircle className="text-blue-500 flex-shrink-0" size={18} />
                                Mobile &amp; Desktop Viewports
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                High Quality (Retina/4K)
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                5 Concurrent Requests
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                Email Support
                            </li>
                        </ul>
                    </div>

                    {/* Business Plan */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-slate-900 mb-2">Business</h3>
                            <p className="text-sm text-slate-500">For high-volume data extraction.</p>
                        </div>
                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-4xl font-semibold tracking-tight text-slate-900">${prices.business}</span>
                            <span className="text-slate-400 text-sm">/mo</span>
                        </div>
                        <Link href="#" className="block w-full py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium text-center hover:bg-slate-50 hover:border-slate-300 transition-all mb-8">
                            Contact Sales
                        </Link>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                25,000 Screenshots / month
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                <span className="font-medium text-slate-900">Stealth Mode</span> (Undetectable)
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                Premium Proxy Rotation
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                WaitSelector Smart Wait
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                GPU Priority Processing
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle className="text-slate-400 flex-shrink-0" size={18} />
                                24/7 Priority Support
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto px-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center tracking-tight">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {/* Question 1 */}
                    <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 open:shadow-md">
                        <summary className="flex justify-between items-center p-5 cursor-pointer list-none text-slate-800 font-medium hover:bg-slate-50 transition-colors">
                            <span>Does it work with React/Vue/Angular sites?</span>
                            <span className="transition-transform duration-300 group-open:rotate-180 flex items-center text-slate-400">
                                <ChevronDown size={20} />
                            </span>
                        </summary>
                        <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                            Yes, we render the full Javascript before capturing. Our engine waits for the DOM to settle and network activity to cease before taking the shot.
                        </div>
                    </details>

                    {/* Question 2 */}
                    <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 open:shadow-md">
                        <summary className="flex justify-between items-center p-5 cursor-pointer list-none text-slate-800 font-medium hover:bg-slate-50 transition-colors">
                            <span>What is &apos;Smart Cookie Cleaner&apos;?</span>
                            <span className="transition-transform duration-300 group-open:rotate-180 flex items-center text-slate-400">
                                <ChevronDown size={20} />
                            </span>
                        </summary>
                        <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                            Our AI-driven selector automatically removes GDPR banners, newsletter popups, and overlays before the screenshot is taken, ensuring a clean image every time.
                        </div>
                    </details>

                    {/* Question 3 */}
                    <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 open:shadow-md">
                        <summary className="flex justify-between items-center p-5 cursor-pointer list-none text-slate-800 font-medium hover:bg-slate-50 transition-colors">
                            <span>What happens if I exceed my limit?</span>
                            <span className="transition-transform duration-300 group-open:rotate-180 flex items-center text-slate-400">
                                <ChevronDown size={20} />
                            </span>
                        </summary>
                        <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                            We will notify you via email when you reach 80% and 100% of your quota. Hard limits apply on the Free tier. Soft limits apply on Pro plans, with a small overage fee for extra requests.
                        </div>
                    </details>

                    {/* Question 4 */}
                    <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 open:shadow-md">
                        <summary className="flex justify-between items-center p-5 cursor-pointer list-none text-slate-800 font-medium hover:bg-slate-50 transition-colors">
                            <span>Do you support full-page screenshots?</span>
                            <span className="transition-transform duration-300 group-open:rotate-180 flex items-center text-slate-400">
                                <ChevronDown size={20} />
                            </span>
                        </summary>
                        <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                            Yes, full-page scrolling screenshots are available on Pro and Business plans. We stitch the content together seamlessly, handling lazy-loaded images automatically.
                        </div>
                    </details>
                </div>
            </section>
        </main>
    );
}

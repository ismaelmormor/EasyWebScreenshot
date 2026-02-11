'use client';

import { useState } from 'react';
import {
    Laptop,
    Smartphone,
    Link as LinkIcon,
    ArrowRight,
    Download,
    ShieldCheck,
    Eye,
    Ghost,
    CheckCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { generateScreenshot } from '../actions';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [url, setUrl] = useState('https://apple.com');
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [isLoading, setIsLoading] = useState(false);
    const [imgSrc, setImgSrc] = useState({
        desktop: 'https://placehold.co/1920x1080/f1f5f9/94a3b8?text=Enter+URL+to+Capture',
        mobile: 'https://placehold.co/390x844/f1f5f9/94a3b8?text=Mobile+Preview'
    });

    const handleCapture = async () => {
        if (isLoading) return;

        setIsLoading(true);

        // Basic URL validation
        let targetUrl = url;
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = `https://${targetUrl}`;
        }

        try {
            const result = await generateScreenshot(targetUrl, device);

            if (result.success && result.imageBase64) {
                setImgSrc(prev => ({
                    ...prev,
                    [device]: result.imageBase64
                }));
            } else if (result.error === 'unauthorized') {
                router.push('/login');
            } else {
                console.error(result.error);
                alert(result.error || 'Failed to capture screenshot');
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (type: 'desktop' | 'mobile') => {
        const imageToDownload = imgSrc[type];
        if (!imageToDownload || imageToDownload.startsWith('https://placehold.co')) return;

        try {
            const link = document.createElement('a');
            link.href = imageToDownload;
            link.download = `screenshot-${type}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image.');
        }
    };


    return (
        <main className="pt-32 pb-20 overflow-hidden flex-grow">

            {/* Hero Section */}
            <section className="max-w-5xl mx-auto px-6 text-center mb-16 relative">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10 opacity-60"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    V2.0 is now live with 50% faster rendering
                </div>

                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                    Capture any website <br className="hidden md:block" /> instantly via API.
                </h1>

                <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                    The fastest screenshot API with anti-cookie technology. Stop worrying about headless browsers and rendering quirks, just get the image.
                </p>

                {/* Interactive Demo Component */}
                <div className="relative max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden" id="demo-container">

                    {/* Toolbar */}
                    <div className="border-b border-slate-100 p-4 flex flex-col md:flex-row items-center gap-4 bg-white relative z-10">
                        {/* URL Input */}
                        <div className="relative flex-grow w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <LinkIcon size={20} />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="https://apple.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>

                        {/* Device Toggle & Action */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setDevice('desktop')}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-all flex items-center gap-2",
                                        device === 'desktop' ? "bg-white text-slate-900" : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    <Laptop size={14} /> Desktop
                                </button>
                                <button
                                    onClick={() => setDevice('mobile')}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                                        device === 'mobile' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    <Smartphone size={14} /> Mobile
                                </button>
                            </div>
                            <button
                                onClick={handleCapture}
                                disabled={isLoading}
                                className={clsx(
                                    "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap",
                                    isLoading && "opacity-75 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>Capture Website</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Viewport Area */}
                    <div className="bg-slate-50 p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden transition-colors duration-500">

                        {/* Grid Pattern */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                                backgroundSize: '24px 24px',
                                opacity: 0.4
                            }}
                        ></div>

                        {/* Desktop Frame */}
                        <div className={clsx("relative w-full max-w-3xl transition-all duration-500 transform", device === 'mobile' && "hidden")}>
                            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                                {/* Browser Chrome */}
                                <div className="bg-white border-b border-slate-100 h-8 flex items-center px-4 gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                                    <div className="ml-4 flex-1 h-4 bg-slate-50 rounded-full max-w-[200px]"></div>
                                </div>
                                {/* Image Container */}
                                <div className="relative bg-slate-100 aspect-[16/10] w-full overflow-hidden group">
                                    <img
                                        src={imgSrc.desktop}
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                        alt="Result"
                                    />

                                    {/* Hover Download Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => handleDownload('desktop')}
                                            className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <Download size={16} /> Download Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Frame */}
                        <div className={clsx("relative w-[280px] transition-all duration-500 transform", device === 'desktop' && "hidden")}>
                            <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl ring-1 ring-slate-900/5">
                                <div className="bg-white rounded-[2.25rem] overflow-hidden relative aspect-[390/844] group">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

                                    <img
                                        src={imgSrc.mobile}
                                        className="w-full h-full object-cover"
                                        alt="Mobile Result"
                                    />

                                    {/* Hover Download Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-30">
                                        <button
                                            onClick={() => handleDownload('mobile')}
                                            className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        <div
                            className={clsx(
                                "absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity duration-300",
                                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                            )}
                        >
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-sm font-medium text-slate-600 animate-pulse">Rendering pixels...</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Trusted By (Social Proof) */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-8">Trusted by developers at</p>
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-lg font-bold tracking-tighter text-slate-800">ACME<span className="text-blue-600">.CORP</span></span>
                    <span className="text-lg font-bold tracking-tighter text-slate-800">Stardust</span>
                    <span className="text-lg font-bold tracking-tighter text-slate-800">echo<span className="font-normal text-slate-500">valley</span></span>
                    <span className="text-lg font-bold tracking-tighter text-slate-800">NEXUS</span>
                    <span className="text-lg font-bold tracking-tighter text-slate-800">F<span className="tracking-normal">oo</span>bar</span>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-6 mb-32">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheck size={22} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Anti-Cookie Cloud</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Our intelligent proxy network automatically accepts cookies and dismisses GDPR banners before capturing the image. Clean shots, every time.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Eye size={22} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Retina Quality</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Support for @2x and @3x pixel density. Capture full-page scrolling screenshots up to 10,000px height without rendering glitches.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Ghost size={22} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Stealth Mode</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Undetectable headless browsing. We rotate user agents and IPs to prevent bot detection and ensure your requests never get blocked.
                        </p>
                    </div>
                </div>
            </section>

            {/* Developer Section */}
            <section className="max-w-7xl mx-auto px-6 mb-32">
                <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-300 text-xs font-medium mb-6">
                                Developer First
                            </div>
                            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 tracking-tight">
                                Integrate in minutes, <br />scale to millions.
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 font-light">
                                Stop maintaining your own Puppeteer cluster. Our REST API is designed to be integrated into any stack with a single HTTP request.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-300 text-sm">
                                    <CheckCircle size={16} className="text-blue-500" />
                                    99.9% Uptime SLA
                                </li>
                                <li className="flex items-center gap-3 text-slate-300 text-sm">
                                    <CheckCircle size={16} className="text-blue-500" />
                                    Webhooks for async processing
                                </li>
                                <li className="flex items-center gap-3 text-slate-300 text-sm">
                                    <CheckCircle size={16} className="text-blue-500" />
                                    S3 Storage Integration
                                </li>
                            </ul>

                            <Link href="/docs" className="inline-flex items-center gap-2 text-white font-medium hover:text-blue-400 transition-colors">
                                Read Documentation <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Code Snippet */}
                        <div className="relative">
                            <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">BASH</span>
                                </div>
                                <div className="p-6 overflow-x-auto">
                                    <pre className="font-mono text-xs md:text-sm leading-relaxed text-slate-300">
                                        <span className="text-purple-400">curl</span> -X POST https://api.easywebscreenshot.com/v1/capture \<br />
                                        &nbsp;&nbsp;-H <span className="text-green-400">&quot;Authorization: Bearer YOUR_API_KEY&quot;</span> \<br />
                                        &nbsp;&nbsp;-H <span className="text-green-400">&quot;Content-Type: application/json&quot;</span> \<br />
                                        &nbsp;&nbsp;-d <span className="text-blue-300">&apos;{'{'}<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&quot;url&quot;: &quot;<span className="text-yellow-300">{url || 'https://apple.com'}</span>&quot;,<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&quot;device&quot;: &quot;<span className="text-yellow-300">{device}</span>&quot;,<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&quot;full_page&quot;: true<br />
                                            &nbsp;&nbsp;{'}'}&apos;</span>
                                    </pre>
                                </div>
                            </div>
                            {/* Decoration behind code */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

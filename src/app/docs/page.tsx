'use client';

import { useState, useEffect } from 'react';
import { Camera, Menu, Copy, CheckCircle, HelpCircle, Info, ShieldCheck, Ghost } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeSnippets = {
    curl: `curl -X POST https://api.easywebscreenshot.com/screenshot \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://www.apple.com",
    "display": "desktop",
    "fullPage": true,
    "delay": 2000
  }' \\
  --output screenshot.jpg`,
    node: `const fs = require('fs');

async function capture() {
  const response = await fetch('https://api.easywebscreenshot.com/screenshot', {
    method: 'POST',
    headers: {
      'x-api-key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://www.apple.com',
      display: 'desktop',
      fullPage: true,
      json: false // Set to true to get base64
    })
  });

  if (!response.ok) throw new Error('API Error');

  const buffer = await response.arrayBuffer();
  fs.writeFileSync('screenshot.jpg', Buffer.from(buffer));
  console.log('Screenshot saved!');
}

capture();`,
    python: `import requests

url = "https://api.easywebscreenshot.com/screenshot"
headers = {
    "x-api-key": "YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "url": "https://www.apple.com",
    "display": "desktop",
    "fullPage": True
}

response = requests.post(url, json=payload, headers=headers)

if response.status_code == 200:
    with open("screenshot.jpg", "wb") as f:
        f.write(response.content)
    print("Screenshot saved successfully")
else:
    print(f"Error: {response.status_code}, {response.text}")`,
    php: `<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'https://api.easywebscreenshot.com/screenshot');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://www.apple.com',
    'display' => 'desktop',
    'fullPage' => true
]));

$headers = [
    'x-api-key: YOUR_API_KEY',
    'Content-Type: application/json'
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    file_put_contents('screenshot.jpg', $result);
    echo "Screenshot saved";
}

curl_close($ch);
?>`
};

const NavLink = ({ href, children, activeSection, onClick }: { href: string, children: React.ReactNode, activeSection: string, onClick: () => void }) => {
    const sectionId = href.replace('#', '');
    const isActive = activeSection === sectionId;
    return (
        <a
            href={href}
            onClick={onClick}
            className={clsx(
                "block px-3 py-2 text-sm rounded-l-md transition-colors",
                isActive
                    ? "text-blue-600 font-medium bg-blue-50 border-r-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900"
            )}
        >
            {children}
        </a>
    );
};

export default function DocsPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python' | 'php'>('curl');
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState('introduction');

    // Scroll Spy
    useEffect(() => {
        const handleScroll = () => {
            // Target specific sections and divs that correspond to navigation links
            // using a more specific selector if possible, or just all elements with IDs in the main content.
            // Given the structure, we can iterate over known IDs or just query all potentially relevant elements.
            const targets = document.querySelectorAll('section[id], #parameters, #code-examples');

            let current = '';
            // Standard scrollspy logic: find the last element that has passed the threshold
            targets.forEach(section => {
                const element = section as HTMLElement;
                if (window.scrollY >= element.offsetTop - 150) {
                    current = element.getAttribute('id') || '';
                }
            });

            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount to set initial state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const copyCode = () => {
        navigator.clipboard.writeText(codeSnippets[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Simple alert or toast could be added here
    };

    return (
        <div className="bg-white text-slate-800 font-sans antialiased">

            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Camera className="text-blue-600" size={20} />
                    <span>Easy Web Screenshot</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-slate-900">
                    <Menu size={24} />
                </button>
            </div>

            <div className="flex min-h-screen relative">

                {/* Sidebar Navigation */}
                <aside className={clsx(
                    "fixed top-0 bottom-0 left-0 w-64 bg-slate-50 border-r border-slate-200 z-40 sidebar-scroll overflow-y-auto transition-transform duration-300 transform lg:translate-x-0 lg:block",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="p-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 tracking-tight mb-8">
                            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white">
                                <Camera size={16} className="text-white" />
                            </div>
                            <span>Easy Web Screenshot</span>
                        </Link>

                        <nav className="space-y-8">
                            <div>
                                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Getting Started</h5>
                                <ul className="space-y-1">
                                    <li><NavLink href="#introduction" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Introduction</NavLink></li>
                                    <li><NavLink href="#authentication" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Authentication</NavLink></li>
                                    <li><NavLink href="#features" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Features & Limits</NavLink></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Core Resources</h5>
                                <ul className="space-y-1">
                                    <li><NavLink href="#endpoint-screenshot" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Capture Screenshot</NavLink></li>
                                    <li><NavLink href="#parameters" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Parameters</NavLink></li>
                                    <li><NavLink href="#code-examples" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Code Examples</NavLink></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Reference</h5>
                                <ul className="space-y-1">
                                    <li><NavLink href="#response-structure" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Response Object</NavLink></li>
                                    <li><NavLink href="#errors" activeSection={activeSection} onClick={() => setMobileMenuOpen(false)}>Errors</NavLink></li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                    <div className="p-6 mt-auto border-t border-slate-200">
                        <Link href="#" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            <HelpCircle size={18} />
                            Support
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:pl-64 w-full">
                    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">

                        {/* Introduction */}
                        <section id="introduction" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-2 text-blue-600 mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md border border-blue-100">API V2.0</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Documentation</h1>
                            <p className="text-lg text-slate-500 leading-relaxed mb-6">
                                Welcome to the Easy Web Screenshot API. Programmatically capture pixel-perfect screenshots of any website with our high-performance rendering engine.
                            </p>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-medium text-slate-400">BASE URL</span>
                                    <code className="text-sm font-mono text-slate-800">https://api.easywebscreenshot.com</code>
                                </div>
                                <button onClick={() => copyToClipboard('https://api.easywebscreenshot.com')} className="text-slate-400 hover:text-blue-600 transition-colors">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </section>

                        {/* Authentication */}
                        <section id="authentication" className="mb-16 scroll-mt-24 border-t border-slate-100 pt-12">
                            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4 group cursor-pointer">
                                Authentication <a href="#authentication" className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity ml-2">#</a>
                            </h2>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Authenticate your requests by including your API key in the header. You can obtain your API key from your dashboard settings.
                            </p>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3">
                                <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-blue-800">
                                    <strong>Note:</strong> Keep your API keys secure. Do not expose them in client-side code (browsers).
                                </div>
                            </div>

                            <div className="rounded-lg overflow-hidden border border-slate-800 shadow-sm">
                                <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                                    <span className="text-xs font-mono text-slate-400">HEADERS</span>
                                </div>
                                <SyntaxHighlighter
                                    language="bash"
                                    style={oneDark}
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: '0 0 0.5rem 0.5rem',
                                        fontSize: '0.875rem',
                                        padding: '1.5rem',
                                        border: '1px solid #1e293b',
                                        borderTop: 'none'
                                    }}
                                    wrapLongLines={true}
                                >
                                    {`x-api-key: YOUR_API_KEY_HERE\nContent-Type: application/json`}
                                </SyntaxHighlighter>
                            </div>
                        </section>

                        {/* Core Endpoint */}
                        <section id="endpoint-screenshot" className="mb-16 scroll-mt-24 border-t border-slate-100 pt-12">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200 font-mono">POST</span>
                                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">/screenshot</h2>
                            </div>

                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Captures a screenshot of the specified URL. The API handles cookie consent banners, waits for the page to load (network idle), and returns the image buffer or a base64 string.
                            </p>

                            {/* Feature Flags */}
                            <div id="features" className="grid sm:grid-cols-2 gap-4 mb-10 scroll-mt-24">
                                <div className="p-4 border border-slate-200 rounded-lg bg-white">
                                    <div className="flex items-center gap-2 mb-2 text-slate-900 font-medium">
                                        <ShieldCheck className="text-blue-600" />
                                        Smart Cookie Cleaner
                                    </div>
                                    <p className="text-xs text-slate-500">Automatically accepts cookies and closes GDPR popups before capture.</p>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-lg bg-white">
                                    <div className="flex items-center gap-2 mb-2 text-slate-900 font-medium">
                                        <Ghost className="text-purple-600" />
                                        Stealth Mode
                                    </div>
                                    <p className="text-xs text-slate-500">Rotates User-Agents and IPs to avoid bot detection.</p>
                                </div>
                            </div>

                            {/* Parameters Table (Simplified for brevity) */}
                            <div id="parameters" className="mb-10 scroll-mt-24">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Body Parameters</h3>
                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Parameter</th>
                                                <th className="px-4 py-3 font-medium">Type</th>
                                                <th className="px-4 py-3 font-medium">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-mono text-slate-700">url <span className="ml-2 text-[10px] uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold tracking-wider">Required</span></td>
                                                <td className="px-4 py-4 text-slate-500">string</td>
                                                <td className="px-4 py-4 text-slate-600">The full URL of the website to capture. Must include protocol (http/https).</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-mono text-slate-700">display</td>
                                                <td className="px-4 py-4 text-slate-500">string</td>
                                                <td className="px-4 py-4 text-slate-600">Viewport preset. Options: <code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">desktop</code> (1920x1080) or <code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">mobile</code> (iPhone 14 Pro). Default: <span className="italic text-slate-400">desktop</span>.</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-mono text-slate-700">fullPage</td>
                                                <td className="px-4 py-4 text-slate-500">boolean</td>
                                                <td className="px-4 py-4 text-slate-600">If true, scrolls the page to capture the entire height. Default: <span className="italic text-slate-400">false</span>.</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-mono text-slate-700">json</td>
                                                <td className="px-4 py-4 text-slate-500">boolean</td>
                                                <td className="px-4 py-4 text-slate-600">If true, returns a JSON object with base64 image. If false, returns image buffer. Default: <span className="italic text-slate-400">false</span>.</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-mono text-slate-700">delay</td>
                                                <td className="px-4 py-4 text-slate-500">number</td>
                                                <td className="px-4 py-4 text-slate-600">Wait time in milliseconds after load before capturing. Useful for animations. Default: <span className="italic text-slate-400">1500</span>.</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-mono text-slate-700">waitSelector</td>
                                                <td className="px-4 py-4 text-slate-500">string</td>
                                                <td className="px-4 py-4 text-slate-600">CSS selector to wait for before capturing (max 6s). E.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">.main-content</code>.</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-4 font-mono text-slate-700">format</td>
                                                <td className="px-4 py-4 text-slate-500">string</td>
                                                <td className="px-4 py-4 text-slate-600">Output format. Options: <code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">jpeg</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-800">png</code>. Default: <span className="italic text-slate-400">jpeg</span>.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Interactive Code Examples */}
                            <div id="code-examples" className="mb-12 scroll-mt-24">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Code Examples</h3>

                                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
                                    {/* Tab Header */}
                                    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-2">
                                        <div className="flex gap-1">
                                            {(['curl', 'node', 'python', 'php'] as const).map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setActiveTab(lang)}
                                                    className={clsx(
                                                        "px-4 py-3 text-xs font-medium border-b-2 transition-colors focus:outline-none capitalize",
                                                        activeTab === lang ? "text-blue-400 border-blue-500" : "text-slate-400 border-transparent hover:text-slate-200"
                                                    )}
                                                >
                                                    {lang === 'node' ? 'Node.js' : lang}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={copyCode} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded transition-colors mr-2">
                                            {copied ? <CheckCircle className="text-green-400" size={14} /> : <Copy size={14} />}
                                            <span className={clsx(copied && "text-green-400")}>{copied ? 'Copied!' : 'Copy'}</span>
                                        </button>
                                    </div>

                                    {/* Code Blocks */}
                                    <div className="relative">
                                        <SyntaxHighlighter
                                            language={activeTab === 'curl' ? 'bash' : activeTab === 'node' ? 'javascript' : activeTab}
                                            style={oneDark}
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0',
                                                fontSize: '0.875rem',
                                                padding: '1.5rem',
                                                background: '#0f172a'
                                            }}
                                            wrapLongLines={true}
                                            showLineNumbers={false}
                                        >
                                            {codeSnippets[activeTab]}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Responses Section */}
                        <section id="response-structure" className="mb-16 scroll-mt-24 border-t border-slate-100 pt-12">
                            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-6">Responses</h2>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <h4 className="font-medium text-slate-900">Success <span className="text-slate-400 font-normal ml-1">(200 OK) - JSON Mode</span></h4>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                                        <SyntaxHighlighter
                                            language="json"
                                            style={oneDark}
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0',
                                                fontSize: '0.875rem',
                                                padding: '1.5rem',
                                                background: '#0f172a'
                                            }}
                                            wrapLongLines={true}
                                            showLineNumbers={false}
                                        >
                                            {`{
  "status": "success",
  "data": {
    "url": "https://www.apple.com",
    "format": "jpeg",
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  }
}`}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>

                                <div id="errors" className="scroll-mt-24">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        <h4 className="font-medium text-slate-900">Error <span className="text-slate-400 font-normal ml-1">(400 Bad Request)</span></h4>
                                    </div>
                                    <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                                        <SyntaxHighlighter
                                            language="json"
                                            style={oneDark}
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0',
                                                fontSize: '0.875rem',
                                                padding: '1.5rem',
                                                background: '#0f172a'
                                            }}
                                            wrapLongLines={true}
                                            showLineNumbers={false}
                                        >
                                            {`{
  "status": "error",
  "message": "Falta el parámetro URL"
}`}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    <footer className="border-t border-slate-200 mt-20 py-10 px-6">
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-slate-500">© 2024 Easy Web Screenshot API.</p>
                            <div className="flex gap-6">
                                <Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Status</Link>
                                <Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Privacy</Link>
                                <Link href="#" className="text-sm text-slate-500 hover:text-slate-900">Terms</Link>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>

            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </div>
    );
}

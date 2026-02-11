import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 w-full bg-slate-50 pt-16">
                {children}
            </div>
            <Footer />
        </div>
    );
}

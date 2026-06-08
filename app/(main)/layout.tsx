

import Sidebar from "@/components/Sidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="mx-auto max-w-7xl px-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
                <div className="hidden lg:block lg:col-span-3">
                    <Sidebar />
                </div>

                <div className="lg:col-span-9">{children}</div>
            </div>
        </main>
    );
}
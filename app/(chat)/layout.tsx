

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="h-[calc(100vh-64px)] w-full">
            {children}
        </main>
    );
}
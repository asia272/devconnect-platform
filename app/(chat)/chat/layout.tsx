export default function ChatLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-[calc(100vh-64px)]">
            {children}
        </div>
    );
}

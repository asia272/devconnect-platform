import ConversationList from "../messages/MessageComponents/ConversationList";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full w-full overflow-hidden flex">
            {/* Desktop Only */}
            <div className="hidden md:block w-[380px] border-r shrink-0">
                <ConversationList />
            </div>

            {/* Mobile + Desktop */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}


import ConversationList from "./MessageComponents/ConversationList";

export default function MessagesPage() {
    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="w-full md:w-[380px] border-r shrink-0">
                <ConversationList />
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center">
                <p>Select a conversation</p>
            </div>
        </div>
    );
}
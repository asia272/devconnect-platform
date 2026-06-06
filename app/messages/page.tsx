import ConversationList from "./MessageComponents/ConversationList";

export default function MessagesPage() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="border rounded-xl h-[80vh] overflow-hidden">
                <ConversationList />
            </div>
        </div>
    );
}
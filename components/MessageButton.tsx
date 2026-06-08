"use client";

import { useStartChat } from "@/app/hooks/useStartChat";

export default function MessageButton({ userId }: { userId: string }) {
    const { startChat, loadingUserId } = useStartChat();

    return (
        <button
            onClick={() => startChat(userId)}
            disabled={loadingUserId === userId}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50 cursor-pointer"
        >
            {loadingUserId === userId ? "Opening..." : "Message"}
        </button>
    );
}
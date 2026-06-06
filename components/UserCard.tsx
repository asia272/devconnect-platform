"use client";

import { useRouter } from "next/navigation";

export default function UserCard({ user }: any) {
    const router = useRouter();

    const startChat = async () => {
        const res = await fetch("/api/chat/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ targetUserId: user.id }),
        });

        const data = await res.json();

        router.push(`/chat/${data.channelId}`);
    };

    return (
        <div className="border p-3 flex justify-between items-center rounded">
            <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
            </div>

            <button
                onClick={startChat}
                className="bg-blue-500 text-white px-3 py-1 rounded"
            >
                Message
            </button>
        </div>
    );
}
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function useStartChat() {
    const router = useRouter();
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

    const startChat = useCallback(async (targetUserId: string) => {
        try {
            setLoadingUserId(targetUserId);

            const res = await fetch("/api/chat/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ targetUserId }),
            });

            const data = await res.json();

            if (data?.channelId) {
                router.push(`/chat/${data.channelId}`);
            }
        } catch (error) {
            console.error("Failed to start chat:", error);
        } finally {
            setLoadingUserId(null);
        }
    }, [router]);

    return {
        startChat,
        loadingUserId,
    };
}
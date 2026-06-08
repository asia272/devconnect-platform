"use client";

import { useStartChat } from "@/app/hooks/useStartChat";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function MessageButton({ userId }: { userId: string }) {
    const { startChat, loadingUserId } = useStartChat();

    const isLoading = loadingUserId === userId;

    return (
        <Button
            size={"sm"}
            onClick={() => startChat(userId)}
            disabled={isLoading}
            className="cursor-pointer"

        >
            {isLoading ? (
                <span className="flex items-center gap-1">
                    <Loader2 className="size-4 animate-spin" />
                </span>
            ) : (
                "Message"
            )}
        </Button>
    );
}
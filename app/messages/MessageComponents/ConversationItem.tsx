"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
export default function ConversationItem({
    channel,
}: {
    channel: any;
}) {
    const user = channel.member;

    return (
        <Link
            href={`/chat/${channel.id}`}
            className="flex items-center gap-4 p-4 border-b hover:bg-muted transition"
        >
            <div className="relative">
                <img
                    src={
                        user?.image ||
                        "/default-avatar.png"
                    }
                    className="w-12 h-12 rounded-full"
                />

                {user?.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">
                        {user?.name || "Unknown"}
                    </h3>

                    {channel.lastMessageAt && (
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                                new Date(channel.lastMessageAt),
                                { addSuffix: true }
                            )}
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground truncate">
                    {channel.lastMessage || "No messages yet"}
                </p>
            </div>
        </Link>
    );
}
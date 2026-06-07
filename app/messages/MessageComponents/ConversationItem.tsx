"use client";

import Link from "next/link";
export default function ConversationItem({
    channel,
    typingUser,
}: {
    channel: any;
    typingUser?: string;
}) {
    const user = channel.member;

    const messageTime = channel.lastMessageAt
        ? new Date(channel.lastMessageAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    return (
        <Link
            href={`/chat/${channel.id}`}
            className={`flex items-center gap-3 px-4 py-3 border-b hover:bg-muted transition ${channel.unreadCount > 0
                ? "bg-green-50/50 dark:bg-green-950/10"
                : ""
                }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <img
                    src={
                        user?.image ||
                        "/default-avatar.png"
                    }
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                />

                {user?.online && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">

                {/* Top Row */}
                <div className="flex items-center justify-between">
                    <h3
                        className={`truncate ${channel.unreadCount > 0
                            ? "font-semibold"
                            : "font-medium"
                            }`}
                    >
                        {user?.name || "Unknown"}
                    </h3>

                    <span
                        className={`text-xs ${channel.unreadCount > 0
                            ? "text-green-600 font-medium"
                            : "text-muted-foreground"
                            }`}
                    >
                        {messageTime}
                    </span>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-1 gap-2">
                    <p
                        className={`text-sm truncate ${typingUser
                                ? "text-green-500 font-medium"
                                : "text-muted-foreground"
                            }`}
                    >
                        {typingUser
                            ? "typing..."
                            : channel.lastMessage}
                    </p>

                    {channel.unreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                            {channel.unreadCount}
                        </span>
                    )}
                </div>

            </div>
        </Link>
    );
}
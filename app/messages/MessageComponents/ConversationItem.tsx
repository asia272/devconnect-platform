"use client";

import { Check, CheckCheck, CheckCheckIcon } from "lucide-react";
import Link from "next/link";
export default function ConversationItem({
    client,
    channel,
    typingUser,
}: {
    channel: any;
    client: any;
    typingUser?: string;
}) {



    const lastMsg = channel.lastMessage();
    const lastMessage = lastMsg?.text || "";
    const messageTime = lastMsg?.created_at
        ? new Date(lastMsg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
        : ""
    const members = Object.values(channel.state.members || {});
    const otherMember: any = members.find(
        (m: any) => m.user?.id !== client?.userID
    );
    const user = otherMember?.user;
    const otherUserId = otherMember?.user?.id;

    const isRead = (() => {
        if (!lastMsg || !otherUserId) return false;

        const readState = channel.state.read?.[otherUserId];

        if (!readState?.last_read) return false;

        return (
            new Date(readState.last_read).getTime() >=
            new Date(lastMsg.created_at).getTime()
        );
    })();


    const isMyMessage = lastMsg?.user?.id === client?.userID;
    const isDelivered = isMyMessage;
    const unreadCount = channel.countUnread();

    return (
        <Link
            href={`/chat/${channel.id}`}
            className={`flex items-center gap-3 px-4 py-3 border-b hover:bg-muted transition ${unreadCount > 0
                ? "bg-green-50/50 dark:bg-green-950/10"
                : ""
                }`}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <img
                    src={user?.image || "/default-avatar.png"}
                    alt={user?.name || "User"}
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
                        className={`truncate ${unreadCount > 0 ? "font-semibold text-black dark:text-white" : "font-medium text-gray-500"
                            }`}
                    >
                        {user?.name || "Unknown"}
                    </h3>

                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {messageTime}


                    </span>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-1 gap-2">
                    {/* LEFT SIDE: Tick + message */}
                    <div className="flex items-center gap-1 min-w-0">
                        {/* Read / sent tick */}
                        {lastMsg && isMyMessage && (
                            <span className="flex items-center justify-center text-[12px] leading-none">
                                {/* SENT */}
                                {!isDelivered && (
                                    <Check className="w-3.5 h-3.5 text-gray-400" />
                                )}

                                {/* DELIVERED (default in Stream) */}
                                {isDelivered && !isRead && (
                                    <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
                                )}

                                {/* READ */}
                                {isRead && (
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                )}
                            </span>
                        )}
                        {/* Message */}
                        <p
                            className={`text-sm truncate ${typingUser
                                ? "text-green-500 font-medium"
                                : unreadCount > 0
                                    ? "text-black dark:text-white font-medium"
                                    : "text-gray-500"
                                }`}
                        >
                            {typingUser
                                ? "typing..."
                                : lastMessage || "No messages yet"}
                        </p>
                    </div>

                    {/* RIGHT SIDE: Unread badge */}
                    {unreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1 rounded-full bg-green-500 text-white text-xs flex items-center justify-center shrink-0">
                            {unreadCount}
                        </span>
                    )}
                </div>

            </div>
        </Link>
    );
}
"use client";

import { useEffect } from "react";
import {
    TypingIndicatorProps,
    useChannelStateContext,
    useChatContext,
    useTypingContext,
} from "stream-chat-react";

export default function CustomTypingIndicator({
    isMessageListScrolledToBottom = true,
    scrollToBottom,
    threadList,
}: TypingIndicatorProps) {
    const { channelConfig, thread } =
        useChannelStateContext();

    const { client } = useChatContext();

    const { typing = {} } = useTypingContext();

    const typingUsers = Object.values(
        typing
    ).filter(({ parent_id, user }) => {
        if (user?.id === client.user?.id)
            return false;

        if (threadList)
            return parent_id === thread?.id;

        return !parent_id;
    });

    useEffect(() => {
        if (
            typingUsers.length > 0 &&
            isMessageListScrolledToBottom
        ) {
            scrollToBottom();
        }
    }, [
        typingUsers.length,
        isMessageListScrolledToBottom,
        scrollToBottom,
    ]);

    if (
        channelConfig?.typing_events === false
    )
        return null;

    if (
        !typingUsers.length ||
        !isMessageListScrolledToBottom
    )
        return null;

    return (
        <div className="px-4 py-2 text-sm text-muted-foreground">
            {typingUsers
                .map((u) => u.user?.name)
                .join(", ")}
            {" "}
            is typing...
        </div>
    );
}
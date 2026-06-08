"use client";

import { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";
import { useChatClient } from "@/components/provider/ChatProvider";

export default function ConversationList() {
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typingChannels, setTypingChannels] =
        useState<Record<string, string>>({});

    const client = useChatClient();

    // const loadChannels = async () => {
    //     try {
    //         const res = await fetch("/api/chat/channels");
    //         const data = await res.json();

    //         const sorted = data.channels.sort(
    //             (a: any, b: any) =>
    //                 new Date(b.lastMessageAt || 0).getTime() -
    //                 new Date(a.lastMessageAt || 0).getTime()
    //         );

    //         setChannels(sorted);
    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Load channels once
    const loadChannels = async () => {
        if (!client) return;

        const channels = await client.queryChannels(
            {
                type: "messaging",
                members: { $in: [client.userID!] },
            },
            { last_message_at: -1 },
            { watch: true, state: true }
        );

        setChannels([...channels]);
        setLoading(false); //  IMPORTANT FIX
    };
    useEffect(() => {
        if (!client) return;

        loadChannels();
    }, [client]);
    // Refresh on new message
    useEffect(() => {
        if (!client) return;

        const refresh = () => loadChannels();

        client.on("message.new", refresh);
        client.on("notification.mark_read", refresh);

        return () => {
            client.off("message.new", refresh);
            client.off("notification.mark_read", refresh);
        };
    }, [client]);
    // Typing handlers
    const typingStart = (event: any) => {
        const channelId = event.cid?.split(":")[1];

        if (!client || event.user?.id === client.userID) return;

        setTypingChannels((prev) => ({
            ...prev,
            [channelId]: event.user?.name,
        }));
    };

    const typingStop = (event: any) => {
        const channelId = event.cid?.split(":")[1];

        setTypingChannels((prev) => {
            const copy = { ...prev };
            delete copy[channelId];
            return copy;
        });
    };

    // Typing listeners
    useEffect(() => {
        if (!client) return;

        client.on("typing.start", typingStart);
        client.on("typing.stop", typingStop);

        return () => {
            client.off("typing.start", typingStart);
            client.off("typing.stop", typingStop);
        };
    }, [client]);

    if (loading) {
        return <div className="p-4">Loading conversations...</div>;
    }

    return (
        <div className="w-full">
            {channels.map((channel) => (
                <ConversationItem
                    key={channel.id}
                    channel={channel}
                    client={client}
                    typingUser={typingChannels[channel.id]}
                />
            ))}
        </div>
    );
}
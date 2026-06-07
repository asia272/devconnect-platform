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

    const loadChannels = async () => {
        try {
            const res = await fetch(
                "/api/chat/channels"
            );

            const data = await res.json();

            const sorted = data.channels.sort(
                (a: any, b: any) =>
                    new Date(b.lastMessageAt || 0).getTime() -
                    new Date(a.lastMessageAt || 0).getTime()
            );

            setChannels(sorted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChannels();
    }, []);

    useEffect(() => {
        if (!client) return;
        const refresh = () => {
            loadChannels();
        };
        client.on("message.new", refresh);

        return () => {
            client.off("message.new", refresh);
        };
    }, [client]);

    const typingStart = (event: any) => {
        const channelId = event.cid?.split(":")[1];

        if (
            event.user?.id === client.userID
        )
            return;

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

    client.on(
        "typing.start",
        typingStart
    );

    client.on(
        "typing.stop",
        typingStop
    );

    if (loading) {
        return (
            <div className="p-4">
                Loading conversations...
            </div>
        );
    }

    return (
        <div className="w-full">
            {channels.map((channel) => (
                <ConversationItem
                    key={channel.id}
                    channel={channel}
                    typingUser={
                        typingChannels[channel.id]
                    }
                />
            ))}
        </div>
    );
}
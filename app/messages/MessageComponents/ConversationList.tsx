"use client";

import { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";

export default function ConversationList() {
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChannels = async () => {
            try {
                const res = await fetch(
                    "/api/chat/channels"
                );

                const data = await res.json();

                setChannels(data.channels);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadChannels();
    }, []);

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
                />
            ))}
        </div>
    );
}
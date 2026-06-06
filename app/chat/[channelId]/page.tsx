"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
    Chat,
    Channel,
    ChannelHeader,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import { Smile, SendHorizonal } from "lucide-react";
import { useChatClient } from "@/components/provider/ChatProvider";

export default function ChatPage() {
    const params = useParams();
    const client = useChatClient();
    const [message, setMessage] = useState("");
    const [channel, setChannel] = useState<any>(null);

    useEffect(() => {
        if (!client) return;

        let isMounted = true;

        const loadChannel = async () => {
            try {
                const ch = client.channel(
                    "messaging",
                    params.channelId as string,
                    {
                        watch: true,
                        state: true,
                        presence: true,


                        read: true,
                    }
                );
                await ch.watch();

                if (isMounted) {
                    setChannel(ch);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadChannel();

        return () => {
            isMounted = false;
        };
    }, [client, params.channelId]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            await channel.sendMessage({
                text: message,
            });

            setMessage("");
        } catch (error) {
            console.error(error);
        }
    };


    type ChannelMember = {
        user?: {
            id?: string;
            name?: string;
            online?: boolean;
        };
    };

    const members: ChannelMember[] = channel
        ? (Object.values(channel.state.members) as ChannelMember[])
        : [];

    const otherMember = members.find(
        (member) => member.user?.id !== client.userID
    );

    const isOnline = otherMember?.user?.online ?? false;
    if (!client || !channel) {
        return <div className="p-10">Loading chat...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden">
                <Chat client={client} theme="messaging light">

                    <Channel channel={channel}>

                        <Window>

                            <div className="border-b p-4 flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold">
                                        {otherMember?.user?.name || "Chat"}
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        {isOnline ? "🟢 Online" : "⚫ Offline"}
                                    </p>
                                </div>
                            </div>

                            {/* MESSAGES (includes typing UI internally) */}
                            <div className="h-[65vh] overflow-y-auto px-2">
                                <MessageList />
                            </div>

                            {/* INPUT */}
                            <div className="border-t bg-background p-4">
                                <div className="flex items-center gap-3">
                                    <button className="text-muted-foreground hover:text-foreground">
                                        😊
                                    </button>

                                    <input
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                sendMessage();
                                            }
                                        }}
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 rounded-lg border bg-background px-4 py-2 outline-none"
                                    />

                                    <button
                                        onClick={sendMessage}
                                        className="rounded-lg bg-blue-500 text-white px-4 py-2"
                                    >
                                        <SendHorizonal className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                        </Window>

                        <Thread />

                    </Channel>

                </Chat>
            </div>
        </div>
    );
}
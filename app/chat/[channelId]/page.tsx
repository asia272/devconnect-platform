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
import EmojiPicker, {
    EmojiClickData,
} from "emoji-picker-react";

export default function ChatPage() {
    const params = useParams();
    const client = useChatClient();
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);
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
                await ch.markRead();
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

            await channel.markRead();

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
            image?: string;
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
    const onEmojiClick = (
        emojiData: EmojiClickData
    ) => {
        setMessage(
            (prev) => prev + emojiData.emoji
        );
    };
    return (
        <div className="max-w-5xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden">
                <Chat client={client} theme="messaging light">

                    <Channel channel={channel}>

                        <Window>

                            <div className="border-b p-4 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={otherMember?.user?.image}
                                            className="w-10 h-10 rounded-full"
                                        />

                                        <div>
                                            <h2>{otherMember?.user?.name}</h2>

                                            <p>
                                                {isOnline
                                                    ? "Online"
                                                    : "Offline"}
                                            </p>
                                        </div>
                                    </div>

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
                                <div className="relative flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setShowEmojiPicker(
                                                !showEmojiPicker
                                            )
                                        }
                                        className="text-muted-foreground hover:text-foreground text-xl"
                                    >
                                        😊
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-16 left-4 z-50">
                                            <EmojiPicker
                                                onEmojiClick={onEmojiClick}
                                            />
                                        </div>
                                    )}

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
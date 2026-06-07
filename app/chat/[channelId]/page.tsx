"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
    Chat,
    Channel,

    MessageList,
    Thread,
    Window,
    MessageComposer,
} from "stream-chat-react";


import { useChatClient } from "@/components/provider/ChatProvider";

import { WithComponents } from "stream-chat-react";

import CustomTypingIndicator from "@/components/chat/TypingIndicator";

export default function ChatPage() {
    const params = useParams();
    const client = useChatClient();

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

    return (
        <div className="max-w-5xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden">
                <Chat client={client} theme="messaging light">
                    <WithComponents
                        overrides={{
                            TypingIndicator: CustomTypingIndicator,
                        }}
                    >
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


                                    </div>
                                </div>

                                {/* MESSAGES (includes typing UI internally) */}

                                <div className="h-[65vh] overflow-y-auto px-2">
                                    <MessageList />
                                </div>


                                <MessageComposer />
                            </Window>

                            <Thread />

                        </Channel>
                    </WithComponents>

                </Chat>
            </div>
        </div>
    );
}
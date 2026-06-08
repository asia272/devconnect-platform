"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
    Chat,
    Channel,

    MessageList,
    Thread,
    Window,
    MessageComposer,
} from "stream-chat-react";

import { useRouter } from "next/navigation";
import { useChatClient } from "@/components/provider/ChatProvider";

import { WithComponents } from "stream-chat-react";

import CustomTypingIndicator from "@/components/chat/TypingIndicator";


type ChannelMember = {
    user?: {
        id?: string;
        name?: string;
        online?: boolean;
        image?: string;
    };
};



export default function ChatPage() {
    const params = useParams();
    const client = useChatClient();
    const router = useRouter();
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
    //Mark as read  msg
    useEffect(() => {
        if (!channel) return;

        channel.markRead();
    }, [channel]);

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

    // const goToProfile = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    // }




    return (
        <div className="h-full">
            <div className="h-full border-l bg-card overflow-hidden flex flex-col">
                <Chat client={client} theme="messaging light">
                    <WithComponents
                        overrides={{
                            TypingIndicator: CustomTypingIndicator,
                        }}
                    >
                        <Channel channel={channel}>

                            <Window>

                                <div className="border-b p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">

                                        <Link
                                            href="/messages"
                                            className="md:hidden"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </Link>

                                        <img
                                            src={otherMember?.user?.image}
                                            className="w-10 h-10 rounded-full cursor-pointer"

                                        />

                                        <div>
                                            <h2

                                                className="cursor-pointer hover:underline"
                                            >
                                                {otherMember?.user?.name}

                                            </h2>

                                            <p
                                                className={`text-xs ${isOnline
                                                    ? "text-green-500"
                                                    : "text-gray-500"
                                                    }`}
                                            >
                                                {isOnline ? "Online" : "Offline"}
                                            </p>
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
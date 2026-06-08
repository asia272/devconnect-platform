"use client";


import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { StreamChat } from "stream-chat";

const ChatContext = createContext<any>(null);

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export function ChatProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [client, setClient] = useState<any>(null);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const chatClient = StreamChat.getInstance(apiKey);

                const res = await fetch("/api/chat/token");
                const data = await res.json();

                if (!data?.user?.id || !data?.token) {
                    throw new Error("Invalid token response");
                }

                await chatClient.connectUser(
                    {
                        id: data.user.id,   //  Prisma ID
                        name: data.user.name,
                        image: data.user.image,
                        username: data.user.username,
                    },
                    data.token
                );

                if (mounted) {
                    setClient(chatClient);
                }
            } catch (err) {
                console.error("Chat init error:", err);
            }
        };

        init();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <ChatContext.Provider value={client}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChatClient = () =>
    useContext(ChatContext);
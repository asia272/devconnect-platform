import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });

    if (!dbUser) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    const serverClient = StreamChat.getInstance(
        apiKey,
        apiSecret
    );
    const channels = await serverClient.queryChannels(
        {
            type: "messaging",
            members: {
                $in: [dbUser.id],
            },
        },
        {
            last_message_at: -1,
        },
        {
            watch: false,
            state: true,
        }
    );
    const formattedChannels = channels
        .map((channel) => {
            const members = Object.values(channel.state.members);

            const otherMember = members.find(
                (m: any) => m.user?.id !== dbUser.id
            );

            if (!otherMember) return null;

            const lastMessage =
                channel.state.messages[
                channel.state.messages.length - 1
                ];

            return {
                id: channel.id,
                lastMessage: lastMessage?.text || "",
                lastMessageAt: channel.state.last_message_at,

                member: {
                    id: otherMember.user?.id,
                    name: otherMember.user?.name,
                    image: otherMember.user?.image,
                    online: otherMember.user?.online ?? false,
                },
            };
        })
        .filter(Boolean);

    return NextResponse.json({
        channels: formattedChannels,
    });


}
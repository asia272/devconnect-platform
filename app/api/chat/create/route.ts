import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";
import prisma from "@/lib/prisma";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

const serverClient = StreamChat.getInstance(
    apiKey,
    apiSecret
);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { targetUserId } = await req.json();

        if (!userId || !targetUserId) {
            return NextResponse.json(
                { error: "Missing data" },
                { status: 400 }
            );
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
        });

        const targetUser = await prisma.user.findUnique({
            where: {
                id: targetUserId,
            },
        });

        if (!currentUser || !targetUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // STEP 1: Ensure both users exist in Stream
        await serverClient.upsertUsers([
            {
                id: currentUser.id,
                name:
                    currentUser.name ||
                    currentUser.username,
                image: currentUser.image || "",
            },
            {
                id: targetUser.id,
                name:
                    targetUser.name ||
                    targetUser.username,
                image: targetUser.image || "",
            },
        ]);

        // STEP 2: Create deterministic channel id
        const channelId = [
            currentUser.id,
            targetUser.id,
        ]
            .sort()
            .join("-");

        // STEP 3: Get or create channel
        const channel = serverClient.channel(
            "messaging",
            channelId,
            {
                members: [
                    currentUser.id,
                    targetUser.id,
                ],
                created_by_id: currentUser.id,
            }
        );

        await channel.watch();

        return NextResponse.json({
            success: true,
            channelId,
        });
    } catch (error) {
        console.error(
            "Create Chat Error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to create chat",
            },
            {
                status: 500,
            }
        );
    }
}
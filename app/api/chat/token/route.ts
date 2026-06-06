import { StreamChat } from "stream-chat";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    await serverClient.upsertUser({
        id: dbUser.id,
        name: dbUser.name || dbUser.username,
        image: dbUser.image || "",
    });

    const token = serverClient.createToken(dbUser.id);

    return NextResponse.json({
        token,
        user: {
            id: dbUser.id,
            name: dbUser.name || dbUser.username,
            image: dbUser.image || "",
        },
    });
}
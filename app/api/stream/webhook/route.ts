import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StreamChat } from "stream-chat";
import { gunzipSync } from "zlib";

const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
);

export async function POST(req: Request) {
    try {
        // ✅ STEP 1: read raw body safely
        const buffer = Buffer.from(await req.arrayBuffer());

        console.log("RAW WEBHOOK BODY:", buffer.toString("utf-8"));

        let body: any = null;

        // ✅ STEP 2: try normal JSON
        try {
            body = JSON.parse(buffer.toString("utf-8"));
        } catch (err) {
            // ✅ STEP 3: fallback gzip
            try {
                body = JSON.parse(gunzipSync(buffer).toString("utf-8"));
            } catch (gzipErr) {
                console.log("❌ Could not parse webhook body");
                return NextResponse.json({ ok: true });
            }
        }

        console.log("WEBHOOK PARSED:", body);

        // ✅ STEP 4: validate event
        if (!body || body.type !== "message.new") {
            return NextResponse.json({ ok: true });
        }

        const message = body.message;
        const channel = body.channel;

        if (!message?.user?.id || !channel?.id) {
            return NextResponse.json({ ok: true });
        }

        const senderId = message.user.id;

        const streamChannel = serverClient.channel(
            channel.type,
            channel.id
        );

        await streamChannel.watch();
        const membersResponse = await streamChannel.queryMembers(
            {},
            {},
            { limit: 100 }
        );

        const members = membersResponse.members
            .map((m: any) => m.user_id || m.user?.id)
            .filter(Boolean);

        console.log("👥 MEMBERS:", members);

        const notifications = members
            .filter((userId: string) => userId !== senderId)
            .map((userId: string) => ({
                userId,
                creatorId: senderId,
                type: "MESSAGE" as const,
                read: false,
                channelId: channel.id,
            }));

        console.log("NOTIFICATIONS:", notifications);

        if (!notifications.length) {
            return NextResponse.json({ ok: true });
        }

        await prisma.notification.createMany({
            data: notifications,
            skipDuplicates: true,
        });

        console.log("✅ Notifications created");

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ WEBHOOK ERROR:", error);
        return NextResponse.json({ ok: true }, { status: 200 });
    }
}
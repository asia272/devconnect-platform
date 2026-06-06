"use server";

import { serverClient } from "@/lib/stream-chat";
import { getDbUserId } from "./user.action";
import prisma from "@/lib/prisma";

export async function syncUserToStream() {
    const userId = await getDbUserId();
    if (!userId) return;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) return;

    await serverClient.upsertUser({
        id: user.id,
        name: user.name || user.username,
        image: user.image || "",
    });

    return true;
}
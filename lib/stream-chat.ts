import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const secret = process.env.STREAM_API_SECRET!;

// Server-side only client
export const serverClient = StreamChat.getInstance(apiKey, secret);
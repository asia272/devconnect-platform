"use client";

import { useEffect, useState } from "react";
import { getUnreadMessageCount } from "@/app/actions/notification.action";
import { Divide, InboxIcon, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

export default function UnReadMessageBadge() {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const fetchCount = async () => {
            const res = await getUnreadMessageCount();
            setCount(res ?? 0);
        };

        fetchCount();

        const interval = setInterval(fetchCount, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Button variant="outline"
            className="relative inline-flex items-center gap-2  flex items-center gap-1.5 sm:gap-2 rounded px-3 sm:px-4 h-9 sm:h-10 cursor-pointer text-sm"
        >

            {/* Icon */}
            <InboxIcon className="w-5 h-5" />

            {/* Label */}
            <span className="text-sm font-medium">
                Inbox
            </span>

            {/* Badge */}
            {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full shadow-md">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </Button>
    );
}
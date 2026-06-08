import { getRandomUsers } from "@/app/actions/user.action";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";

import MessageButton from "./MessageButton";

async function WhotoFolow() {
    const users = await getRandomUsers();


    if (users?.length === 0) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Who to Follow</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {users?.map((user) => (
                        <div key={user.id} className="flex gap-2 items-center justify-between ">
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/profile/${user?.id}`}
                                >
                                    <Avatar>
                                        <AvatarImage src={user.image ?? "/avatar.png"} />
                                    </Avatar>
                                </Link>
                                <div className="text-xs">
                                    <Link
                                        href={`/profile/${user?.id}`}

                                        className="font-medium cursor-pointer"
                                    >
                                        {user.name?.trim() || user.username}
                                    </Link>
                                    <p className="text-muted-foreground">@{user.username}</p>
                                    <p className="text-muted-foreground">{user._count.followers} followers</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageButton userId={user.id} />
                                <FollowButton userId={user.id} />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default WhotoFolow;
import UserCard from "@/components/UserCard";
import prisma from "@/lib/prisma";

export default async function UsersPage() {
    const users = await prisma.user.findMany();

    return (
        <div className="p-5 space-y-3">
            <h1 className="text-xl font-bold">All Users</h1>

            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}
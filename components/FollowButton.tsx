"use client"
import { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleFollow } from '@/app/actions/user.action';

const FollowButton = ({ userId }: { userId: string }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            await toggleFollow(userId)
            toast.success("User followed successfuloly")
        } catch (error) {
            toast.error("Error following user")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button size={"sm"}
            variant={"secondary"}
            onClick={handleFollow}
            disabled={isLoading}
            className="cursor-pointer" >
            {isLoading ? <Loader2 className='size-4 animate-spin' /> : "Follow"}
        </Button>
    )
}

export default FollowButton

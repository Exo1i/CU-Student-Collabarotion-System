'use client';
import {UserIcon} from 'lucide-react';
import React from 'react';
import {useUser} from '@clerk/nextjs';
import Loading from "@/app/(main)/loading";

const UserInfo = () => {
    const {isSignedIn, user, isLoaded} = useUser();

    if (!isLoaded) return <Loading />;
    if (!isSignedIn) return <div>Please sign in to access your profile.</div>;
    console.log(user.fullName);

    return (
        <p className="flex items-center justify-center text-gray-500">
            <UserIcon className="w-4 h-4 mr-2" />
            {/* {user.emailAddresses}  */}
        </p>
    );
};

export default UserInfo;

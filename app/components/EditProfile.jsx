'use client'
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import Image from "next/image"
import {useUser} from "@clerk/nextjs";
import {useRef} from "react";
import Loading from "@/app/(main)/loading";

export function EditProfile() {
    const crtPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const usernameRef = useRef(null);
    const nameRef = useRef(null);
    const {isSignedIn, user, isLoaded} = useUser();
    if (!isLoaded) {
        return <Loading />;
    }

    if (!isSignedIn) {
        return null;
    }

    const updatePassword = async () => {

        // @TODO: make this use the global alert toast
        // @TODO: For later, If this returned an error then either newpassword isn't valid or current password is wrong
        await user.updatePassword({
            currentPassword: crtPasswordRef.current.value,
            newPassword: newPasswordRef.current.value,
            signOutOfOtherSessions: true
        })
    }

    const updateUserName = async () => {
        // @TODO: validate that the user entered a first and lastname
        await user.update({
            username: usernameRef.current.value,
            firstName: nameRef.current.value.split(' ')[0],
            lastName: nameRef.current.value.split(' ')[1]
        })
    }
    return (<Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you are done.
                </DialogDescription>
                <div className="flex  items-center gap-4 p-6 bg-white rounded-lg shadow-lg mr-6">
                    <div className="flex-shrink-0">
                        <Image
                            src={user.imageUrl}
                            width={60}
                            height={60}
                            alt="User Profile"
                            className="rounded-full"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{user.fullName}</h2>
                        <p className="text-sm text-gray-500">Student Profile</p>
                    </div>
                </div>

            </DialogHeader>
            <Tabs defaultValue="account" className="w-[400px] pr-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you are done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" ref={nameRef} defaultValue={user.fullName} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" ref={usernameRef} defaultValue={user.username} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            {/* @TODO: exit the modal after successful update*/}
                            <Button onClick={updateUserName}>Save changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you will be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Current password</Label>
                                <Input id="current" type="password" ref={crtPasswordRef} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New password</Label>
                                <Input id="new" type="password" ref={newPasswordRef} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            {/* @TODO: exit the modal after successful update*/}
                            <Button onClick={updatePassword}>Update password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </DialogContent>
    </Dialog>)
}

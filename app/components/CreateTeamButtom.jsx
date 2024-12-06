"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"

export default function CreateTeamButton({ projectID , TeamNum }) {
    const [teamName, setTeamName] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000) // Notification will disappear after 5 seconds

            return () => clearTimeout(timer)
        }
    }, [notification])

    const handleCreateTeam = async (e) => {
        e.preventDefault()

        try {
            // Here you would typically make an API call to create the team
            // For this example, we'll simulate a successful creation
            await new Promise(resolve => setTimeout(resolve, 1000))

            setNotification({
                type: "success",
                title: "Team created successfully",
                message: `Team "${teamName}" has been added to the project.`
            })
            setIsOpen(false)
            setTeamName("")
        } catch (error) {
            setNotification({
                type: "error",
                title: "Error creating team",
                message: "There was a problem creating the team. Please try again."
            })
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default">Create Team</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>
                            Enter a name for the new team. Click create when you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTeam}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="teamName" className="text-right">
                                    Team Name
                                </Label>
                                <Input
                                    id="teamName"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create Team</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {notification && (
                <Alert
                    variant={notification.type === "success" ? "default" : "destructive"}
                    className={`z-[9999] fixed bottom-4 right-4 w-96 animate-in fade-in slide-in-from-bottom-5 ${notification.type === "success" ? "bg-green-100 border-green-500 text-green-800" : "bg-red-100 border-red-500 text-red-800"
                        }`}
                >
                    {notification.type === "success" ? (
                        <CheckCircledIcon className="h-4 w-4" />
                    ) : (
                        <CrossCircledIcon className="h-4 w-4" />
                    )}
                    <AlertTitle>{notification.title}</AlertTitle>
                    <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
            )}
        </>
    )
}


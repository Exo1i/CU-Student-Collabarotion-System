'use client'

import {useEffect, useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {EarnBadge} from '@/actions/assignBadge'
import {useRouter} from 'next/navigation'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {CheckCircledIcon, CrossCircledIcon} from "@radix-ui/react-icons"

export default function GiveBadgeDialog({ children, userId }) {
    const [open, setOpen] = useState(false)
    const [badgeId, setBadgeId] = useState('')
    const router = useRouter();
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [notification])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await EarnBadge(userId, badgeId)
            if (result.status === 201) {
                setNotification({
                    type: "success",
                    title: result.message,
                })
            } else {
                setNotification({
                    type: "error",
                    title: "Error giving badge",
                    message: `${result.message}`
                })
            }
        } catch (e) {
            console.log(e)
            setNotification({
                type: "error",
                title: "Error giving badge",
                message: `${result.message}`
            })
        }
        setOpen(false)
        setBadgeId('')
        router.refresh();
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Give Badge</DialogTitle>
                        <DialogDescription>
                            Assign an existing badge to this Student. Enter the badge ID and click save.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="badgeId" className="text-right">
                                    Badge ID
                                </Label>
                                <Input
                                    id="badgeId"
                                    value={badgeId}
                                    onChange={(e) => setBadgeId(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Assign Badge</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {
                notification && (
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
                )
            }
        </>
    )
}


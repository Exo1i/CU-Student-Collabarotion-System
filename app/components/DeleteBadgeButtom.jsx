'use client'

import {Button} from '@/components/ui/button'
import {Trash2Icon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {DeleteStudentBadge} from "@/actions/deleteBadge"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {CheckCircledIcon, CrossCircledIcon} from "@radix-ui/react-icons"
import {useEffect, useState} from "react"

export default function DeleteBadgeButton({ userId, badgeId }) {
    const router = useRouter()
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [notification])
    const handleDelete = async () => {

        try {
            const result = await DeleteStudentBadge(userId, badgeId)
            if (result.status === 200) {
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
        router.refresh();
    }

    return (
        <>
            <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                onClick={handleDelete}
            >
                <Trash2Icon className="h-3 w-3" />
                <span className="sr-only">Delete Badge</span>
            </Button>
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


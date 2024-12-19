'use client'

import {useEffect, useState} from 'react'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Star} from 'lucide-react'
import {GiveReview} from '@/actions/add-review'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {CheckCircledIcon, CrossCircledIcon} from "@radix-ui/react-icons"

export default function ReviewDialog({ isOpen, onClose, member, projectID }) {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [notification])
    const handleSubmit = async () => {
        try {
            const res = await GiveReview(member.user_id, projectID, review, rating);
            if (res.status === 201) {
                setNotification({
                    type: "success",
                    title: "review added successfully",
                })
            }
            else if(res.status ===200) {
                setNotification({
                    type: "success",
                    title: "review updated successfully",
                })
            }
            else {
                setNotification({
                    type: "error",
                    title: "Error adding submission",
                    message: `${res.message}`
                })
            }
        } catch (err) {
            setNotification({
                type: "error",
                title: "Error adding submission",
                message: `${res.message}`
            })
            console.log(err)
        }
        onClose()
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Review {member?.full_name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-8 h-8 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <Textarea
                            placeholder="Write your review here..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSubmit}>
                            Submit Review
                        </Button>
                    </DialogFooter>
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


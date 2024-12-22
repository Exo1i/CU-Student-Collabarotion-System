"use client";

import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {EarnBadge} from "@/actions/assignBadge";
import {useRouter} from "next/navigation";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {CheckCircledIcon, CrossCircledIcon} from "@radix-ui/react-icons";

export default function GiveBadgeDialog({children, userId, onBadgeAdded}) {
    const [open, setOpen] = useState(false);
    const [badgeId, setBadgeId] = useState("");
    const [badges, setBadges] = useState([]);
    const router = useRouter();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        if (open) {
            const fetchBadges = async () => {
                try {
                    const response = await fetch("/api/badges");
                    if (!response.ok) {
                        throw new Error("Failed to fetch badges");
                    }
                    const data = await response.json();
                    setBadges(data.badges);
                } catch (error) {
                    console.error("Error fetching badges:", error);
                }
            };
            fetchBadges();
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await EarnBadge(userId, badgeId);
            if (result.status === 201) {
                setNotification({
                    type: "success", title: result.message,
                });
                onBadgeAdded(badges.find((badge) => badge.badge_id === badgeId));
            } else {
                setNotification({
                    type: "error", title: "Error giving badge", message: result.message,
                });
            }
        } catch (error) {
            console.error(error);
            setNotification({
                type: "error", title: "Error giving badge", message: error.message,
            });
        }
        setOpen(false);
        setBadgeId("");
        router.refresh();
    };

    return (<>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Give Badge</DialogTitle>
                    <DialogDescription>
                        Assign an existing badge to this student. Select a badge and click save.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div
                            className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                            {badges.length > 0 ? (<div className="grid gap-4">
                                {badges.map((badge) => (<div
                                    key={badge.badge_id}
                                    className={`flex items-center gap-4 p-2 border rounded cursor-pointer ${badgeId === badge.badge_id ? "bg-blue-100 border-blue-500" : ""}`}
                                    onClick={() => setBadgeId(badge.badge_id)}
                                >
                                    <img
                                        src={badge.picture}
                                        alt={badge.title}
                                        className="w-10 h-10"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{badge.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            {badge.description}
                                        </p>
                                    </div>
                                </div>))}
                            </div>) : (<p className="text-center text-sm text-gray-500">
                                No badges available
                            </p>)}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={!badgeId}>
                            Assign Badge
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        {notification && (<Alert
            variant={notification.type === "success" ? "default" : "destructive"}
            className={`z-[9999] fixed bottom-4 right-4 w-96 animate-in fade-in slide-in-from-bottom-5 ${notification.type === "success" ? "bg-green-100 border-green-500 text-green-800" : "bg-red-100 border-red-500 text-red-800"}`}
        >
            {notification.type === "success" ? (<CheckCircledIcon className="h-4 w-4" />) : (
                <CrossCircledIcon className="h-4 w-4" />)}
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
        </Alert>)}
    </>);
}

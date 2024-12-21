
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { AddTechnology } from "@/actions/add-technology";
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { DeleteTechnology } from "@/actions/delete-technology";
export default function EditTechnology({ technologies, projectId, teamNum, isUserLeader, isUserInThisTeam , onRefresh }) {
    const [newTechnology, setNewTechnology] = useState('');
    const [notification, setNotification] = useState(null);
    const router = useRouter();
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000) // Notification will disappear after 5 seconds

            return () => clearTimeout(timer)
        }
    }, [notification])
    const handleAddTechnology = async () => {
        if (newTechnology.trim() !== '') {
            console.log(`Adding technology: ${newTechnology}`);
            try {
                const res = await AddTechnology(projectId, teamNum, newTechnology);
                if (res.status === 201) {
                    onRefresh();
                } else {
                    setNotification({
                        type: "error",
                        message: `${res.message}`
                    })
                }
            } catch (err) {
                console.log(err);
            }
            setNewTechnology('');
        }
    };

    const handleDeleteTechnology = async (tech) => {
        console.log(`Deleting technology: ${tech}`);
        try {
            const res = await DeleteTechnology(projectId, teamNum, tech);
            if (res.status === 200) {
                onRefresh();
            } else {
                setNotification({
                    type: "error",
                    message: `${res.message}`
                })
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <div className="flex items-center justify-center flex-wrap gap-2 pt-6 mb-4">
                {technologies.map((tech , index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        {isUserLeader && isUserInThisTeam && (
                            <button
                                onClick={() => handleDeleteTechnology(tech)}
                                className="ml-1 text-red-500 hover:text-red-700"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </Badge>
                ))}
                {isUserLeader && isUserInThisTeam && (
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            placeholder="New technology"
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            className="w-32"
                        />
                        <Button onClick={handleAddTechnology} size="sm">
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </div>
                )}
            </div>
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
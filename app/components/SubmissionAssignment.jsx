'use client'
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
export default function SubmissionAssignment({ assignment }) {
    const [notification, setNotification] = useState(null)
    const [assignmentPath, setassignmentPath] = useState("")
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [notification])
    const handleAddAssignmentSubmission = async (e) => {
        e.preventDefault();
        const file = assignmentPath !== "" ? assignmentPath : null;
        if (file) {
            console.log(file);
        } else {
            console.log("No file selected.");
        }
        try {
            // todo Here i will add call for server component
            await new Promise(resolve => setTimeout(resolve, 1000))

            setNotification({
                type: "success",
                title: "Submission added successfully",
            })
        } catch (error) {
            console.log(error)
            setNotification({
                type: "error",
                title: "Error adding submission",
                message: "There was a problem adding the submission. Please try again."
            })
        }
    }
    return (
        <>
            <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor={`attachment-${assignment.assignment_id}`}
                        className="flex items-center text-sm font-medium text-indigo-600 cursor-pointer transition-colors duration-300 hover:text-indigo-800"
                    >
                        <PaperClipIcon className="h-5 w-5 mr-2" />
                        Add Attachment
                    </label>
                    <button
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md transition-colors duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleAddAssignmentSubmission}
                    >
                        Submit
                    </button>
                </div>
                <Input
                    id={`attachment-${assignment.assignment_id}`}
                    type="file"
                    onChange={(e) => setassignmentPath(e.target ? e.target.files[0] : "")}
                    required
                    className= 'hidden'
                />
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

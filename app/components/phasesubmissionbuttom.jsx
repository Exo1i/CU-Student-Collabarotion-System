import { Input } from "@/components/ui/input"
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Button } from "@/components/ui/button"
import { RocketIcon } from "lucide-react"
import { addphaseSubmission } from '@/actions/add-phasesubmission'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { updateSubmission } from "@/actions/update-submission"
export default function Phasesubmissionbutton({ phase, projectID, onRefresh }) {
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [notification])
    const [attachmentpath, setattachmentPath] = useState(null)
    const handellersubmitted = async (e, phasenum) => {
        e.preventDefault();
        const url = attachmentpath  ? attachmentpath.name : null;
        if (url) {
            console.log(url);
        } else {
            console.log("No file selected.");
        }
        try {
            const res = await addphaseSubmission(projectID, phasenum, url)
            console.log(`status code for phase submisiion :` + res.status);
            console.log("notification before : " + notification);
            if (res.status === 201) {
                onRefresh();
            } else {
                setNotification({
                    type: "error",
                    title: "Error adding submission",
                    message: `${res.message}`
                })
            }
        } catch (error) {
            console.log(error)
            setNotification({
                type: "error",
                title: "Error submitting phase",
                message: "There was a problem submitting the phase. Please try again."
            })
        }
    }

    const handleupdateSubmission = async (e) => {
        e.preventDefault();
        console.log("current attachment" + attachmentpath);
        const url = attachmentpath ? attachmentpath.name : null;
        if (url) {
            console.log(url);
        } else {
            console.log("No file selected.");
        }
        try {
            const res = await updateSubmission(phase.submissionID, url);
            console.log("response : " + res)
            if (res.status === 200) {
                setNotification({
                    type: "success",
                    title: "Submission updated successfully",
                })
            } else {
                setNotification({
                    type: "error",
                    title: "Error update submission",
                    message: `${res.message}`
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='flex justify-center mb-4'>
                <label
                    htmlFor={`attachment-${phase.phase_num}`}
                    className="flex items-center text-sm font-medium text-indigo-600 cursor-pointer transition-colors duration-300 hover:text-indigo-800"
                >
                    <PaperClipIcon className="h-5 w-5 mr-2" />
                    Add Attachment
                </label>
                <Input
                    id={`attachment-${phase.phase_num}`}
                    type="file"
                    onChange={(e) => setattachmentPath(e.target ? e.target.files[0] : "")}
                    required
                    className='hidden'
                />
            </div>
            {
                phase.status === 'not_submitted' ? <Button
                    onClick={(e) => handellersubmitted(e, phase.phase_num)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                    <RocketIcon className="w-4 h-4 mr-2" />
                    Submit Phase
                </Button> : <Button
                    onClick={handleupdateSubmission}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                    <RocketIcon className="w-4 h-4 mr-2" />
                    update Submiting Phase
                </Button>
            }
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
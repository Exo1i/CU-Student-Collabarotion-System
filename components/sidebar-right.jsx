'use client'

import {useState} from "react"
import {Calendar} from "@/components/ui/calendar"
import {Sidebar, SidebarContent} from "@/components/ui/sidebar"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"


/// YN @todo: update this to fetch data from an api
// Sample data for tasks
const sampleTasks = {
    "2024-11-01": [{id: 1, title: "Submit Project Proposal", status: "due"}, {
        id: 2, title: "Team Meeting", status: "ongoing"
    },], "2024-03-15": [{id: 3, title: "Midterm Exam", status: "due"}, {
        id: 4, title: "Group Presentation", status: "ongoing"
    },], // Add more sample data as needed
}

export function SidebarRight({...props}) {
    const [date, setDate] = useState(new Date())
    const [tasks, setTasks] = useState([])

    const updateOnDateChange = (newDate) => {
        setDate(newDate)
        if (newDate) {
            const dateString = newDate.toISOString().split('T')[0]
            setTasks(sampleTasks[dateString] || [])
        }
    }

    return (
        <Sidebar
            collapsible="none"
            className="top-0 right-0 h-full bg-background z-50"
            {...props}
        >
            <SidebarContent className="p-4 space-y-4">
                <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={updateOnDateChange}
                        className="rounded-md"
                    />
                </div>
                <Separator />
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-base text-center">Tasks for {date?.toDateString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[10em] w-full pr-4">
                            {tasks.length > 0 ? (tasks.map((task) => (<div key={task.id} className="mb-4 last:mb-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{task.title}</span>
                                    <Badge variant={task.status === 'due' ? 'destructive' : 'default'}>
                                        {task.status}
                                    </Badge>
                                </div>
                            </div>))) : (<p className="text-center text-muted-foreground">No tasks for this day</p>)}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </SidebarContent>
        </Sidebar>
    )
}

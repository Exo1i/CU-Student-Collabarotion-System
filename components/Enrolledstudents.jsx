"use client";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import Image from "next/image";
import {redirect} from "next/navigation";

export default function EnrolledStudents() {
    const [isOpen, setIsOpen] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const resp = await fetch(`/api/students`)
                    .then((response) => response.json())
                    .then((data) => {
                        setStudents(data.students_list);
                    });
            } catch (e) {
                console.log(e);
            }
        };
        getData();
    }, []);

    return (<Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                View Students
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Enrolled Students</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="grid gap-4">
                    {students.map((student) => (<motion.div
                        onClick={() => {
                            redirect(`/profile/${student.user_id}`)
                        }}
                        key={student.user_id}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                        className="flex items-center space-x-4 rounded-lg border p-3 hover:bg-slate-100 transition-colors"
                    >
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                      <Image
                          src={student.img_url !== null ? student.img_url : "/courseImg/student.jpg"}
                          width={80}
                          height={80}
                          className={"rounded-full"}
                          alt={student.fname[0] + student.lname[0]}
                      >
                    </Image>
                  </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">{`${student.fname} ${student.lname}`}</span>
                        </div>
                    </motion.div>))}
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>);
}

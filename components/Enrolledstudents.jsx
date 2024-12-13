"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EnrolledStudents() {
  const [isOpen, setIsOpen] = useState(false);

  const [students, setStudents] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await fetch(`/api/students`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data.students_list);
            setStudents(data.students_list);
          });
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
          View Students
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enrolled Students</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {students.map((student) => (
            <motion.div
              key={student.user_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {`${student.fname} ${student.lname}`}
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

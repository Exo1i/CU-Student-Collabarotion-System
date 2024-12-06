"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentSubmissions() {
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: "Alice Johnson",
      submissionDate: "2023-07-10",
      grade: null,
    },
    {
      id: 2,
      studentName: "Bob Smith",
      submissionDate: "2023-07-11",
      grade: null,
    },
    {
      id: 3,
      studentName: "Charlie Brown",
      submissionDate: "2023-07-12",
      grade: null,
    },
  ]);

  const handleGradeChange = (id, grade) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === id ? { ...sub, grade: parseInt(grade) } : sub
      )
    );
  };

  return (
    <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold mb-4">Student Submissions</h2>
      <div className="mb-4">
        <Label htmlFor="assignment-select">Select Assignment</Label>
        <Input
          id="assignment-select"
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          placeholder="Enter assignment name"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.studentName}</TableCell>
              <TableCell>{submission.submissionDate}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={submission.grade || ""}
                  onChange={(e) =>
                    handleGradeChange(submission.id, e.target.value)
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Save Grade
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

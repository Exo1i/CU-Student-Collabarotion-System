"use client";

import { useRef, useState } from "react";
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
import { addAssignmentGrade } from "@/actions/update-assignmentgrade";
import { useAlert } from "./alert-context";

export default function StudentSubmissions() {
  const { showAlert } = useAlert();
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
    const gradeChange = async function () {
      try {
        const res = await addAssignmentGrade(id, grade);
        if (res.status == 200)
          showAlert({
            message: "assignment graded successfully",
            severity: "success",
          });
      } catch (e) {
        console.log(e);
      }
    };
    gradeChange().then(() => {
      setSubmissions(
        submissions.map((sub) =>
          sub.id === id ? { ...sub, grade: parseInt(grade) } : sub
        )
      );
    });
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
            <SubmissionRow
              key={submission.id}
              submission={submission}
              handleGradeChange={handleGradeChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
function SubmissionRow({ submission, handleGradeChange }) {
  const [grade, setGrade] = useState(submission.grade || "0");
  return (
    <TableRow key={submission.id}>
      <TableCell>{submission.studentName}</TableCell>
      <TableCell>{submission.submissionDate}</TableCell>
      <TableCell>
        <Input
          type="number"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-20"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleGradeChange(submission.id, grade);
          }}
        >
          Save Grade
        </Button>
      </TableCell>
    </TableRow>
  );
}

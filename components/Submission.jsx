"use client";

import { useState } from "react";
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

export default function StudentSubmissions({ submissions }) {
  const { showAlert } = useAlert();
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [currsubmissions, setSubmissions] = useState(
    submissions.flatMap((assignment) =>
      assignment.submissions.map((submission) => ({
        assignment_id: assignment.assignment_id,
        assignment_title: assignment.title,
        ...submission,
      }))
    )
  );

  const handleGradeChange = (id, grade) => {
    const gradeChange = async function () {
      try {
        const res = await addAssignmentGrade(id, Number(grade));
        if (res.status == 200)
          showAlert({
            message: "assignment graded successfully",
            severity: "success",
          });
      } catch (e) {
        showAlert({
          message: e.message,
          severity: "error",
        });
      }
    };
    gradeChange().then(() => {
      setSubmissions(
        currsubmissions.map((sub) =>
          sub.id === id ? { ...sub, grade: parseInt(grade) } : sub
        )
      );
    });
  };
  const filteredSubmissions = currsubmissions.filter((submission) =>
    submission.assignment_title
      .toLowerCase()
      .includes(selectedAssignment.toLowerCase())
  );

  return (
    <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold mb-4">Student Submissions</h2>
      <div className="mb-4">
        <Label htmlFor="assignment-select">Select Assignment</Label>
        <Input
          id="assignment-select"
          value={selectedAssignment}
          onChange={(e) => {
            setSelectedAssignment(e.target.value);
          }}
          placeholder="Enter assignment name"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignment</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.map((submission) => (
            <SubmissionRow
              key={submission.submission_id}
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
    <TableRow key={submission.assignment_id}>
      <TableCell>{submission.assignment_title}</TableCell>
      <TableCell>{submission.student_name}</TableCell>
      <TableCell>{submission.submission_date}</TableCell>
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
            handleGradeChange(submission.submission_id, grade);
          }}
        >
          Save Grade
        </Button>
      </TableCell>
    </TableRow>
  );
}

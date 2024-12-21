"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {AddSubmissionGrade} from "@/actions/update-assignmentgrade";
import {useAlert} from "./alert-context";

export default function StudentSubmissions({submissions, project}) {
    const {showAlert} = useAlert();
    const [submissionType, setSubmissionType] = useState("assignments"); // 'assignments' or 'phases'
    const [searchTerm, setSearchTerm] = useState("");

    // Process assignment submissions
    const assignmentSubmissions = submissions.flatMap((assignment) =>
        assignment.submissions.map((submission) => ({
            type: "assignment",
            assignment_id: assignment.assignment_id,
            assignment_title: assignment.title,
            ...submission,
        }))
    );

    // Process phase submissions
    const phaseSubmissions = project?.phases?.flatMap((phase) =>
        phase.submissions.map((submission) => ({
            type: "phase",
            phase_num: phase.phase_num,
            phase_name: phase.phase_name,
            phase_load: phase.phase_load,
            ...submission,
        }))
    ) || [];

    const [currentSubmissions, setCurrentSubmissions] = useState(assignmentSubmissions);

    // Handle submission type change
    const handleTypeChange = (value) => {
        setSubmissionType(value);
        setSearchTerm("");
        setCurrentSubmissions(
            value === "assignments" ? assignmentSubmissions : phaseSubmissions
        );
    };

    const handleGradeChange = async (id, grade, type) => {
        try {
            // You'll need to implement the API endpoint for phase grading
            const res = await AddSubmissionGrade(id, Number(grade));

            if (res.status === 200) {
                showAlert({
                    message: `${type} submission graded successfully`,
                    severity: "success",
                });

                setCurrentSubmissions(
                    currentSubmissions.map((sub) =>
                        sub.submission_id === id ? {...sub, grade: parseInt(grade)} : sub
                    )
                );
            }
        } catch (e) {
            showAlert({
                message: e.message,
                severity: "error",
            });
        }
    };

    const filteredSubmissions = currentSubmissions.filter((submission) => {
        const searchField = submissionType === "assignments"
            ? submission.assignment_title
            : `Phase ${submission.phase_num}: ${submission.phase_name}`;
        return searchField.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4">Student Submissions</h2>

            <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="submission-type">Submission Type</Label>
                        <Select
                            value={submissionType}
                            onValueChange={handleTypeChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="assignments">Assignments</SelectItem>
                                <SelectItem value="phases">Project Phases</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Label htmlFor="search-input">
                            Search {submissionType === "assignments" ? "Assignment" : "Phase"}
                        </Label>
                        <Input
                            id="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`Enter ${submissionType === "assignments" ? "assignment" : "phase"} name`}
                        />
                    </div>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            {submissionType === "assignments" ? "Assignment" : "Phase"}
                        </TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((submission) => (
                            <SubmissionRow
                                key={submission.submission_id}
                                submission={submission}
                                submissionType={submissionType}
                                handleGradeChange={handleGradeChange}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                                No submissions found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function SubmissionRow({submission, submissionType, handleGradeChange}) {
    const [grade, setGrade] = useState(submission.grade || "0");

    const submissionTitle = submissionType === "assignments"
        ? submission.assignment_title
        : `Phase ${submission.phase_num}: ${submission.phase_name}`;

    return (
        <TableRow>
            <TableCell className="font-medium">{submissionTitle}</TableCell>
            <TableCell>{submission.student_name}</TableCell>
            <TableCell>
                {new Date(submission.submission_date).toLocaleDateString()}
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-20"
                    min="0"
                    max={submissionType === "phases" ? submission.phase_load : "100"}
                />
            </TableCell>
            <TableCell>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        handleGradeChange(submission.submission_id, grade, submissionType);
                    }}
                >
                    Save Grade
                </Button>
            </TableCell>
        </TableRow>
    );
}
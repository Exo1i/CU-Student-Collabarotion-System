"use server";
import {NextResponse} from "next/server";

export async function GET(request) {
  const data = [
    {
      ID: "1",
      title: "HTML Basics",
      maxGrade: 100,
      description: "Learn the basics of HTML by creating a simple webpage.",
      dueDate: "2024-12-01",
      status: "done",
    },
    {
      ID: "2",
      title: "CSS Styling",
      maxGrade: 100,
      description: "Style your webpage using CSS techniques.",
      dueDate: "2024-12-08",
      status: "missed",
    },
    {
      ID: "3",
      title: "Data Analysis Basics",
      maxGrade: 100,
      description: "Analyze a dataset using basic statistics.",
      dueDate: "2024-12-05",
      status: "missed",
    },
    {
      ID: "4",
      title: "Visualization with Python",
      maxGrade: 100,
      description:
        "Create visualizations using Python libraries like Matplotlib and Seaborn.",
      dueDate: "2024-12-12",
      status: "done",
    },
  ];

  return NextResponse.json(data, { status: 200 });
}

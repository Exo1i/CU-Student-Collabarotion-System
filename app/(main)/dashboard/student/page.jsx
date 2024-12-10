import React from "react";
import Schedule from "@/components/schedule";
import { columns } from "@/app/(main)/dashboard/student/columns";
import { DataTable } from "@/app/(main)/dashboard/student/data_table";
import { CalendarDays, Notebook, Users } from "lucide-react";

async function getData() {
  const data = [
    {
      id: "1",
      name: "Web Development Bootcamp",
      courseImage: "/courseImg/coursetest1.jpg",
      description: "Learn to build websites!",
      instructorName: "John Doe",
      instructorImage: "/courseImg/instructortest1.jpg",
      assignments: [
        {
          ID: "1",
          title: "HTML Basics",
          maxGrade: 100,
          description: "Learn the basics of HTML by creating a simple webpage.",
          dueDate: "2024-12-01",
        },
        {
          ID: "2",
          title: "CSS Styling",
          maxGrade: 100,
          description: "Style your webpage using CSS techniques.",
          dueDate: "2024-12-08",
        },
      ],
      project: {
        teamSize: 4,
        description:
          "Build a fully responsive website using HTML, CSS, and JavaScript. Includes interactive features and dynamic elements.",
        projectId: "101",
        startDate: "2024-11-01",
        endDate: "2024-12-15",
        projectName: "Responsive Website Project",
      },
    },
    {
      id: "2",
      name: "Data Science Mastery",
      courseImage: "/courseImg/coursetest2.jpg",
      description: "Master data science concepts!",
      instructorName: "Jane Smith",
      instructorImage: "/courseImg/instructortest1.jpg",
      assignments: [
        {
          ID: "3",
          title: "Data Analysis Basics",
          maxGrade: 100,
          description: "Analyze a dataset using basic statistics.",
          dueDate: "2024-12-05",
        },
        {
          ID: "4",
          title: "Visualization with Python",
          maxGrade: 100,
          description:
            "Create visualizations using Python libraries like Matplotlib and Seaborn.",
          dueDate: "2024-12-12",
        },
      ],
      project: {
        teamSize: 5,
        description:
          "Conduct an in-depth analysis of a real-world dataset. Use Python for data preprocessing, analysis, and visualization.",
        projectId: "102",
        startDate: "2024-10-15",
        endDate: "2024-12-20",
        projectName: "Data Science Capstone",
      },
    },
  ];

  return data.flatMap((course) => course.assignments);
}

export default async function StudentPage() {
  const assignData = await getData();

  //   {
  //     ID: "1",
  //     title: "HTML Basics",
  //     maxGrade: 100,
  //     description: "Learn the basics of HTML by creating a simple webpage.",
  //     dueDate: "2024-12-01",
  //   },
  //   {
  //     ID: "2",
  //     title: "CSS Styling",
  //     maxGrade: 100,
  //     description: "Style your webpage using CSS techniques.",
  //     dueDate: "2024-12-08",
  //   },
  // ];
  return (
    <div>
      <div className="h-full bh-white p-4 rounded-md">
        {/* schedule section */}
        <section>
          <div className="flex items-center  border-l-8 border-[#AB5BF7] bg-[#1A1A1A] text-white rounded w-max p-[10px] shadow-xl">
            <CalendarDays />
            <h1 className="text-3xl font-bold ml-2">Schedule</h1>
          </div>
          <p className="text-sm text-gray-600 my-2">
            Add your plans to the schedule to track them
          </p>
          <Schedule />
        </section>

        {/* Assignments section */}
        <section>
          <div className="flex items-center  mt-14 -mb-8 border-l-8 border-[#AB5BF7] bg-[#1A1A1A] text-white rounded w-max p-[10px] shadow-xl \">
            <Notebook />
            <h2 className="text-3xl font-bold ml-2">Assignments</h2>
          </div>
          <div className="container mx-auto py-10 rounded">
            <DataTable columns={columns} data={assignData} />
          </div>
        </section>

        {/* Teams sections */}
        <section>
          <div className="flex items-center  mt-7 -mb-8 border-l-8 border-[#AB5BF7] bg-[#1A1A1A] text-white rounded w-max p-[10px] shadow-xl \">
            <Users />
            <h2 className="text-3xl font-bold ml-2">Teams</h2>
          </div>
          {/* <div className="container mx-auto py-10 rounded">
            <DataTable columns={columns} data={assignData} />
          </div> */}
        </section>
      </div>
    </div>
  );
}

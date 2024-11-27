import { notFound } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion'
import ProjectTeamCard from "@/app/components/ProjectTeamCard";


export default async function projectPage({ params }) {
    const { projectID } = await params
    const Teams = getTeams(projectID);
    if (!Teams) {
        return notFound();
    }
    return (
        <div className="grid grid-cols-1 gap-8">
            {Teams.map((team) => (
                <ProjectTeamCard key={team.name} Team={team} />
            ))}
        </div>
    )
}


function getTeams(projectID) {
    const projects = [
        {
            name: "Project Alpha",
            id: "101",
            description: "A cutting-edge platform to streamline workflow management.",
            startDate: "2024-01-01",
            endDate: "2024-06-30",
            maxSize: 10,
            teams: [
                {
                    teamNumber: 1,
                    name: "Team Innovators",
                    description: "Focused on developing the core functionality of the platform.",
                    technologies: ["React", "Node.js", "MongoDB"],
                    available: false,
                    progress: 75,
                    members: [
                        {
                            name: "Alice Johnson",
                            role: "leader",
                            photo: "/courseImg/student1.jpg",
                        },
                        {
                            name: "Bob Smith",
                            role: "Backend Developer",
                            photo: "/courseImg/student.jpg",
                        },
                    ],
                },
                {
                    teamNumber: 2,
                    name: "Team Visionaries",
                    description: "Responsible for UI/UX design and user testing.",
                    technologies: ["Figma", "CSS", "JavaScript"],
                    available: true,
                    progress: 0,
                    members: [
                        {
                            name: "Clara Williams",
                            role: "UI/UX Designer",
                            photo: "/courseImg/student.jpg",
                        },
                        {
                            name: "David Brown",
                            role: "Tester",
                            photo: "/courseImg/student.jpg",
                        },
                    ],
                },
                {
                    teamNumber: 3,
                    name: "Team Pioneers",
                    description: "Focusing on performance optimization and security.",
                    technologies: ["Go", "AWS", "Docker"],
                    available: true,
                    progress: 0,
                    members: [
                        {
                            name: "Sam Green",
                            role: "Security Engineer",
                            photo: "/courseImg/student.jpg",
                        },
                        {
                            name: "Lily Moore",
                            role: "DevOps Engineer",
                            photo: "/courseImg/student1.jpg",
                        },
                    ],
                },
            ],
        },
        {
            name: "Project Beta",
            id: "102",
            description: "An innovative mobile app for personalized fitness tracking.",
            startDate: "2024-03-01",
            endDate: "2024-09-30",
            maxSize: 8,
            teams: [
                {
                    teamNumber: 1,
                    name: "Team Builders",
                    description: "Developing the mobile app's core features.",
                    technologies: ["Flutter", "Firebase"],
                    available: true,
                    progress: 0,
                    members: [
                        {
                            name: "Eve Davis",
                            role: "Mobile Developer",
                            photo: "eve.jpg",
                        },
                        {
                            name: "Frank Miller",
                            role: "Database Engineer",
                            photo: "frank.jpg",
                        },
                    ],
                },
                {
                    teamNumber: 2,
                    name: "Team Creators",
                    description: "Handling branding, marketing, and outreach.",
                    technologies: ["Canva", "Social Media Marketing"],
                    available: false,
                    progress: 30,
                    members: [
                        {
                            name: "Grace Lee",
                            role: "Marketing Specialist",
                            photo: "grace.jpg",
                        },
                        {
                            name: "Henry Wilson",
                            role: "Graphic Designer",
                            photo: "henry.jpg",
                        },
                    ],
                },
                {
                    teamNumber: 3,
                    name: "Team Innovators",
                    description: "Responsible for improving user experience and feedback.",
                    technologies: ["Sketch", "Adobe XD", "Jira"],
                    available: false,
                    progress: 50,
                    members: [
                        {
                            name: "Oliver Scott",
                            role: "UX Designer",
                            photo: "oliver.jpg",
                        },
                        {
                            name: "Mia Taylor",
                            role: "User Researcher",
                            photo: "mia.jpg",
                        },
                    ],
                },
            ],
        },
    ];

    // Find the project by ID
    const project = projects.find(project => project.id === projectID);

    // If project is found, return its teams, else return an empty array
    return project ? project.teams : [];
}


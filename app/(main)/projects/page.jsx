import { CalendarDays, Users} from 'lucide-react'
import CustomLink from '@/app/components/MyCustomLink'
export default function ProjectDashboard() {

    const projects = [
        {
            teamSize: 4,
            description: 'Build a fully responsive website using HTML, CSS, and JavaScript. Includes interactive features and dynamic elements.',
            projectId: '101',
            courseId: '1',
            startDate: '2024-11-01',
            endDate: '2024-12-15',
            projectName: 'Responsive Website Project',
        },
        {
            teamSize: 6,
            description: 'Develop a cross-platform mobile application using React Native, integrating APIs for weather and location tracking.',
            projectId: '102',
            courseId: '2',
            startDate: '2024-10-10',
            endDate: '2024-12-05',
            projectName: 'Weather Tracker App',
        },
        {
            teamSize: 8,
            description: 'Design and implement a database management system for an e-commerce platform, including advanced search functionality.',
            projectId: '103',
            courseId: '3',
            startDate: '2024-09-15',
            endDate: '2024-11-30',
            projectName: 'E-Commerce Database System',
        },
        {
            teamSize: 3,
            description: 'Create a machine learning model for image recognition, focusing on identifying plant species from images.',
            projectId: '104',
            courseId: '4',
            startDate: '2024-08-01',
            endDate: '2024-09-15',
            projectName: 'Plant Species Identifier',
        },
    ]
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Project Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.projectId}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
                        >
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{project.projectName}</h2>
                                <p className="text-gray-600 mb-4">{project.description}</p>
                                <div className="flex items-center text-gray-500 mb-2">
                                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                                    <span>Team Size: {project.teamSize}</span>
                                </div>
                                <div className="flex items-center text-gray-500 mb-4">
                                    <CalendarDays className="w-5 h-5 mr-2 text-green-500" />
                                    <span>
                                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <CustomLink href= {`/courses/${project.courseId}/${project.projectId}/phases`}>
                                View Phases
                                </CustomLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


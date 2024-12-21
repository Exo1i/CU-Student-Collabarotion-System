"use client"
import { CalendarDays, Users } from 'lucide-react'
import CustomLink from '@/app/components/MyCustomLink'
import { useEffect, useState } from 'react';
import Loading from '../loading';
export default function ProjectDashboard() {

    const [projects, setprojects] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchprojectsdata = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) {
                    throw new Error(`Failed to fetch projects: ${response.statusText}`);
                }
                const fetchedprojects = await response.json();
                setprojects(fetchedprojects);
            } catch (err) {
                setError(err);
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchprojectsdata();
    }, []);
    if (loading) {
        return <Loading />
    }
    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Project Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.length === 0 ? <div className="text-center text-gray-500 dark:text-gray-400">
                        No courses available for the selected category.
                    </div>
                        : projects.map((project) => (
                            <div
                                key={project.project_id}
                                className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
                            >
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{project.project_name}</h2>
                                    <p className="text-gray-600 mb-4">{project.description}</p>
                                    <div className="flex items-center text-gray-500 mb-2">
                                        <Users className="w-5 h-5 mr-2 text-blue-500" />
                                        <span>Team Size: {project.max_team_size}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <CalendarDays className="w-5 h-5 mr-2 text-green-500" />
                                        <span>
                                            {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CustomLink href={`/courses/${project.course_code}/${project.project_id}`}>
                                        View Teams
                                    </CustomLink>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}


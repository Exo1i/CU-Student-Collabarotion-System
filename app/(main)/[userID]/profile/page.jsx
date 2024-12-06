import Image from 'next/image'
import { CrownIcon, Star, StarHalf, AwardIcon, CodeIcon, UserIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CustomLink from '@/app/components/MyCustomLink'
const userData = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "https://example.com/profiles/john.jpg",
    reviews: [
        {
            projectId: 101,
            projectName: "AI Research",
            reviewerId: 2,
            reviewee: {
                name: "John Doe",
                photo: "https://example.com/profiles/john.jpg"
            },
            rate: 4.5,
            content: "John was an excellent leader and provided great guidance."
        },
        {
            projectId: 102,
            projectName: "Data Analysis",
            reviewerId: 3,
            reviewee: {
                name: "John Doe",
                photo: "https://example.com/profiles/john.jpg"
            },
            rate: 5,
            content: "Very proactive and contributed significantly to the project."
        }
    ],
    projects: [
        {
            projectId: 101,
            name: "AI Research",
            role: "Leader"
        },
        {
            projectId: 103,
            name: "Mobile App Development",
            role: "Member"
        }
    ],
    badges: [
        {
            picture: "https://example.com/badges/innovator.png",
            title: "Innovator"
        },
        {
            picture: "https://example.com/badges/team_player.png",
            title: "Team Player"
        }
    ]
}

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            {hasHalfStar && <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
            {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                <Star key={i + fullStars} className="w-5 h-5 text-gray-300" />
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
    )
}
export default function Profile() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50 blur-3xl"></div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-white tracking-wider">Profile</h1>
                    </div>
                </div>
                <div className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                        <div className="rounded-full border-4 border-white shadow-lg overflow-hidden">
                            <Image
                                src="/courseImg/student.jpg"
                                alt={userData.name}
                                width={128}
                                height={128}
                                className="rounded-full transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    </div>
                    <div className='text-center'>
                        <h2 className='mt-3 text-gray-900 font-bold text-3xl'>
                            {userData.name}
                        </h2>
                        <p className='flex items-center justify-center text-gray-500'>
                            <UserIcon className='w-4 h-4 mr-2' />
                            {userData.email}
                        </p>
                    </div>
                    <div className="text-center mt-4">
                        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text tracking-wide">
                            {userData.badges.length === 0 ? null : <>Student Badges</>}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {userData.badges.map((badge, index) => (
                                <TooltipProvider key={index}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md hover:shadow-lg rounded-full transition-transform transform hover:scale-110">
                                                <Image
                                                    src="/courseImg/badge.jpg"
                                                    alt={badge.title}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p >{badge.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                <div className='flex items-center '>
                    <CodeIcon className='mr-2' />
                    <h1 className='font-bold text-2xl'>Current Projects</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userData.projects.map((project) => (
                        <div key={project.projectId} className={`p-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${project.role === 'Leader' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                            }`}>
                            <div className='flex justify-between'>
                                <h2>
                                    {project.name}
                                </h2>
                                {project.role === 'Leader' ? <CrownIcon className='w-6 h-6 text-yellow-500 animate-pulse' /> : null}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${project.role === 'Leader' ? 'bg-yellow-300 text-yellow-800' : 'bg-gray-300 text-gray-800'}`}>
                                {project.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                <h2 className='text-2xl font-bold mb-4 text-gray-800 flex items-center'>
                    <AwardIcon className="w-6 h-6 mr-2 text-purple-500" />
                    Reviews
                </h2>
                <div className='space-y-4'>
                    {userData.reviews.map((review) => (
                        <div key={review.projectId} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                            <div className='flex justify-between items-center'>
                                <h3 className="text-lg font-semibold">
                                    {review.projectName}
                                </h3>
                                <StarRating rating={review.rate} />
                            </div>
                            <p className="mt-2 text-gray-600 italic">&quot;{review.content}&quot;</p>
                            <div className="mt-4 flex items-center">
                                <Image
                                    src="/courseImg/student.jpg"
                                    alt={review.reviewee.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full mr-2 border-2 border-purple-300"
                                >
                                </Image>
                                <p className="text-sm text-gray-500">
                                    Review from: {review.reviewee.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
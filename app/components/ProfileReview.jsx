'use client'
import {Star, StarHalf, Trash2} from 'lucide-react'
import {Button} from "@/components/ui/button"
import Image from 'next/image'
import {DeleteReview} from '@/actions/DeleteReview'
import {useRouter} from 'next/navigation'

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
        </div>
    )
}
export default function ProfileReview({review , reviewee_ID , role}) {
        const router = useRouter();
    const handleDeleteReview = async (review) => {
        try{
            const res = await DeleteReview(review.reviewer_id , reviewee_ID , review.project_id )
            if(res.status === 200) {
                router.refresh(); 
            }
        } catch(err){
            console.log(err);
        }
    }
    return (
        <div  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className='flex justify-between items-center'>
                <h3 className="text-lg font-semibold">
                    {review.project_name}
                </h3>
                <StarRating rating={review.rating} />
            </div>
            <p className="mt-2 text-gray-600 italic">&quot;{review.content}&quot;</p>
            <div className="mt-4 flex items-center justify-between ">
                <div className='flex items-center'>
                    <Image
                        src="/courseImg/student.jpg"
                        alt={review.reviewr_full_name}
                        width={32}
                        height={32}
                        className="rounded-full mr-2 border-2 border-purple-300"
                    >
                    </Image>
                    <p className="text-sm text-gray-500">
                        Review from: {review.reviewr_full_name}
                    </p>
                </div>
                {
                    role === 'admin' && <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteReview(review)}
                        aria-label={`Delete ${review.reviewr_full_name} review`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                }
            </div>
        </div>
    )
}
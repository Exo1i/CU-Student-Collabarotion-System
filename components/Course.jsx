import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
export default function Course({ courseData }) {
  return (
    <div className="mb-8">
      <Card className="w-4\5 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full">
          <Image
            src={courseData.course_img || "/courseImg/coursetest1.jpg"}
            alt={`${courseData.course_name} thumbnail`}
            layout="responsive"
            width={80}
            height={60}
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
        <CardHeader>
          <CardTitle>Course Name: {courseData.course_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Max Grade: {courseData.max_grade}</p>
        </CardContent>
      </Card>
    </div>
  );
}

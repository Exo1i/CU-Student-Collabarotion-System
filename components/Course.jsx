import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
export default function Course(props) {
  return (
    <div className="mb-8">
      <Card className="w-4\5 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full">
          <Image
            src={props.course.courseImage}
            alt={`${props.course.name} thumbnail`}
            layout="responsive"
            width={80}
            height={60}
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
        <CardHeader>
          <CardTitle>Name: {props.course.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Max Grade: {props.course.maxGrade}</p>
        </CardContent>
      </Card>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  thumbnail: string;
  title: string;
  shortDescription: string;
  price: number; // price in INR, 0 for free
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="p-0">
        <Image
          src={course.thumbnail}
          alt={course.title}
          width={400}
          height={200}
          className="rounded-t-lg object-cover w-full"
        />
      </CardHeader>
      <CardContent className="flex-1">
        <CardTitle>{course.title}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          {course.shortDescription}
        </p>
        <p className="mt-2 font-medium">
          {course.price === 0 ? "Free" : `₹${course.price}`}
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href={`/courses/${course.id}`} passHref>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

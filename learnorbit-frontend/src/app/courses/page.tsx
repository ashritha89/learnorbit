"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CourseCard } from "@/components/CourseCard";

interface Course {
  id: string;
  thumbnail: string;
  title: string;
  shortDescription: string;
  price: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses");
        // The API may return an array directly or an object containing the array (e.g., { courses: [...] })
        const data = response.data;
        const coursesArray = Array.isArray(data) ? data : data.courses || [];
        setCourses(coursesArray);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-8">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Courses</h1>
      {courses.length === 0 ? (
        <p className="text-center">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CourseCard } from "@/components/CourseCard";

interface Course {
  id: string;
  thumbnail: string;
  title: string;
  shortDescription: string;
  price: number;
}

interface StudentDashboardData {
  enrolledCourses: Course[];
  progress: number; // percentage 0-100
  continueLearning: Course[];
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/dashboard/student");
        const resp = response.data;
        // Normalise response shape – accept both direct fields or nested object
        const normalized: StudentDashboardData = {
          enrolledCourses: resp.enrolledCourses ?? resp.courses ?? [],
          progress: resp.progress ?? 0,
          continueLearning: resp.continueLearning ?? [],
        };
        setData(normalized);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-8">{error}</p>;
  }

  if (!data) {
    return null; // should not happen
  }

  return (
    <div className="p-6 space-y-8">
      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-primary h-4 rounded"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.progress}% completed
          </p>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </CardContent>
      </Card>

      {/* Continue Learning */}
      {data.continueLearning.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.continueLearning.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

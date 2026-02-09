import Link from "next/link";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-zinc-900">LearnOrbit</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-6">
            Empower Your Learning
            <span className="block text-indigo-600 mt-2">Journey with LearnOrbit</span>
          </h1>
          <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
            A modern Learning Management System designed for students, instructors,
            and administrators to create, manage, and deliver exceptional educational experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Learning Today
            </Link>
            <Link
              href="/courses"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-zinc-900 mb-12">
          Why Choose LearnOrbit?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Rich Course Content
            </h3>
            <p className="text-zinc-600">
              Access comprehensive courses with video lessons, assignments, and interactive content.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Expert Instructors
            </h3>
            <p className="text-zinc-600">
              Learn from industry professionals and experienced educators worldwide.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Track Progress
            </h3>
            <p className="text-zinc-600">
              Monitor your learning journey with detailed progress tracking and analytics.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Grow Your Skills
            </h3>
            <p className="text-zinc-600">
              Continuously improve with personalized recommendations and skill assessments.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of learners already transforming their careers with LearnOrbit.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">LearnOrbit</span>
            </div>
            <p className="text-sm">
              © 2026 LearnOrbit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

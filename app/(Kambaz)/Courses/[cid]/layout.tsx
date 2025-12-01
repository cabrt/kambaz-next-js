"use client";

import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import ProtectedCourseRoute from "../ProtectedCourseRoute";
import * as quizzesClient from "./Quizzes/client";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department?: string;
  credits?: number;
  description: string;
  image?: string;
}

interface RootState {
  coursesReducer: {
    courses: Course[];
  };
}

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid, qid } = useParams();
  const pathname = usePathname();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course: Course) => course._id === cid);
  const [isNavigationMinimized, setIsNavigationMinimized] = useState(false);
  const [quizTitle, setQuizTitle] = useState<string | null>(null);
  
  // Check if we're on a quiz page
  const isQuizPage = pathname.includes("/Quizzes/") && qid;
  
  // Fetch quiz title if on a quiz page
  useEffect(() => {
    if (isQuizPage && qid) {
      quizzesClient.findQuizById(qid as string)
        .then((quiz) => setQuizTitle(quiz.title))
        .catch(() => setQuizTitle(null));
    } else {
      setQuizTitle(null);
    }
  }, [isQuizPage, qid]);
  
  // Extract section name from pathname
  const pathParts = pathname.split("/");
  let currentSection = pathParts[pathParts.length - 1] || "Home";
  
  // If we have a quiz title, use it instead of the ID
  if (isQuizPage && quizTitle) {
    currentSection = quizTitle;
  }
  
  const toggleNavigation = () => {
    setIsNavigationMinimized(!isNavigationMinimized);
  };
  
  return (
    <ProtectedCourseRoute>
    <div id="wd-courses">
      <h2 className="text-danger">
        <button
          onClick={toggleNavigation}
          className="btn btn-link text-danger p-0 me-3"
          style={{ border: "none", background: "none", cursor: "pointer" }}
          aria-label="Toggle course navigation"
        >
          <FaAlignJustify className="fs-4 mb-1" />
        </button>
        {course && course.name} &gt; {currentSection}
      </h2>
      <hr />
      <div className="d-flex">
        {!isNavigationMinimized && (
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
        )}
        <div className="flex-fill">
          {children}
        </div>
      </div>
    </div>
    </ProtectedCourseRoute>
  );
}

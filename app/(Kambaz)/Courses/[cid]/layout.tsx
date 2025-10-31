"use client";

import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import ProtectedCourseRoute from "../ProtectedCourseRoute";

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
  const { cid } = useParams();
  const pathname = usePathname();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course: Course) => course._id === cid);
  
  // Extract section name from pathname
  console.log("Current pathname:", pathname);
  const pathParts = pathname.split("/");
  console.log("Path parts:", pathParts);
  const currentSection = pathParts[pathParts.length - 1] || "Home";
  console.log("Current section:", currentSection);
  
  return (
    <ProtectedCourseRoute>
      <div id="wd-courses">
        <h2 className="text-danger">
          <FaAlignJustify className="me-3 fs-4 mb-1" />
          {course && course.name} &gt; {currentSection}
        </h2>
        <hr />
        <div className="d-flex">
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
          <div className="flex-fill">
            {children}
          </div>
        </div>
      </div>
    </ProtectedCourseRoute>
  );
}

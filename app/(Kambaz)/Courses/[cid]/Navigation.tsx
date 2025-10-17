"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  const { cid } = useParams();
  
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const href = `/Courses/${cid}/${link}`;
        const isActive = pathname.includes(href);
        return (
          <Link
            key={link}
            href={href}
            className={`list-group-item ${isActive ? "active" : "text-danger"} border-0`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}

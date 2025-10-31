"use client";

import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

interface RootState {
  accountReducer: {
    currentUser: {
      _id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    } | null;
  };
  enrollmentsReducer: {
    enrollments: {
      _id: string;
      user: string;
      course: string;
    }[];
  };
}

export default function ProtectedCourseRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const router = useRouter();
  const params = useParams();
  const cid = params.cid as string;
  
  useEffect(() => {
    if (!currentUser) {
      // Not signed in, redirect to signin
      router.push("/Account/Signin");
      return;
    }
    
    // Check if user is enrolled in this course
    const isEnrolled = enrollments.some(
      (enrollment) => enrollment.user === currentUser._id && enrollment.course === cid
    );
    
    if (!isEnrolled) {
      // Not enrolled, redirect to dashboard
      router.push("/Dashboard");
    }
  }, [currentUser, enrollments, cid, router]);
  
  // Only render if user is signed in and enrolled
  if (currentUser) {
    const isEnrolled = enrollments.some(
      (enrollment) => enrollment.user === currentUser._id && enrollment.course === cid
    );
    
    if (isEnrolled) {
      return <>{children}</>;
    }
  }
  
  return null; // Will redirect via useEffect
}


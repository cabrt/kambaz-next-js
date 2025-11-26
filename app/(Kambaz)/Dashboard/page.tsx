"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";
import { enrollUserInCourse, setEnrollments } from "../Enrollments/reducer";
import ProtectedRoute from "../Account/ProtectedRoute";
import * as userClient from "../Account/client";
import * as courseClient from "../Courses/client";
import * as enrollmentClient from "../Enrollments/client";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

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
  enrolled?: boolean;
}

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
  coursesReducer: {
    courses: Course[];
  };
  enrollmentsReducer: {
    enrollments: Enrollment[];
  };
}

function DashboardContent() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description"
  });
  
  const [enrolling, setEnrolling] = useState<boolean>(false);
  
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  
  const findCoursesForUser = useCallback(async () => {
    if (!currentUser) return;
    try {
      const courses = await userClient.findCoursesForUser(currentUser._id);
      dispatch(setCourses(courses));
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status !== 401) {
          console.error(error);
        }
      } else {
        console.error(error);
      }
      dispatch(setCourses([]));
    }
  }, [currentUser, dispatch]);

  const fetchCourses = useCallback(async () => {
    if (!currentUser) return;
    try {
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(currentUser._id);
      const courses = allCourses.map((course: Course) => {
        if (enrolledCourses.find((c: Course) => c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return course;
        }
      });
      dispatch(setCourses(courses));
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status !== 401) {
          console.error(error);
        }
      } else {
        console.error(error);
      }
      dispatch(setCourses([]));
    }
  }, [currentUser, dispatch]);

  const fetchEnrollments = useCallback(async () => {
    try {
      const enrollments = await enrollmentClient.findMyEnrollments();
      dispatch(setEnrollments(enrollments));
    } catch (error: unknown) {
      // 401 is expected when no user is logged in, handle silently
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status !== 401) {
          console.error(error);
        }
      } else {
        console.error(error);
      }
      // Set enrollments to empty array if fetch fails
      dispatch(setEnrollments([]));
    }
  }, [dispatch]);
  
  useEffect(() => {
    if (currentUser) {
      if (enrolling) {
        fetchCourses();
      } else {
        findCoursesForUser();
      }
      fetchEnrollments();
    }
  }, [currentUser, enrolling, fetchCourses, findCoursesForUser, fetchEnrollments]);
  
  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (enrollment) => enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };
  
  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (!currentUser) return;
    try {
      if (enrolled) {
        await userClient.enrollIntoCourse(currentUser._id, courseId);
      } else {
        await userClient.unenrollFromCourse(currentUser._id, courseId);
      }
      
      // Update local state
      dispatch(setCourses(
        courses.map((course) => {
          if (course._id === courseId) {
            return { ...course, enrolled: enrolled };
          } else {
            return course;
          }
        })
      ));
      
      // Refresh enrollments
      await fetchEnrollments();
      
      // Refresh courses if in enrolling mode
      if (enrolling) {
        await fetchCourses();
      } else {
        await findCoursesForUser();
      }
    } catch (error) {
      console.error("Failed to update enrollment:", error);
    }
  };
  
  const addNewCourse = async () => {
    try {
      const newCourse = await courseClient.createCourse(course);
      dispatch(addCourse(newCourse));
      // Also add to enrollments since server enrolled us
      if (currentUser) {
        dispatch(enrollUserInCourse({ userId: currentUser._id, courseId: newCourse._id }));
      }
      // Refresh enrollments from server
      await fetchEnrollments();
      // Refresh courses based on current view
      if (enrolling) {
        await fetchCourses();
      } else {
        await findCoursesForUser();
      }
      // Reset form
      setCourse({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description"
      });
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };
  
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      dispatch(deleteCourse(courseId));
      // Refresh enrollments and courses from server
      await fetchEnrollments();
      await fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };
  
  const handleUpdateCourse = async () => {
    try {
      await courseClient.updateCourse(course);
      dispatch(updateCourse(course));
      // Refresh courses from server
      await fetchCourses();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };
  
  const filteredCourses = courses || [];

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <Button 
          variant="primary" 
          onClick={() => setEnrolling(!enrolling)}
          className="mb-2 float-end"
        >
          {enrolling ? "My Courses" : "All Courses"}
        </Button>
      </div>
      <hr />
      {isFaculty && (
        <>
          <h5>New Course
              <button className="btn btn-primary float-end"
                      id="wd-add-new-course-click"
                      onClick={addNewCourse} > Add </button>
              <button className="btn btn-warning float-end me-2"
                      id="wd-update-course-click"
                      onClick={handleUpdateCourse} > Update </button>
          </h5><br />
          <FormControl 
            value={course.name} 
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
            placeholder="Course Name"
          />
          <FormControl 
            value={course.description} 
            rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
            placeholder="Course Description"
            as="textarea"
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        {enrolling ? "All Courses" : "Published Courses"} ({filteredCourses.length})
      </h2> 
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={`/Courses/${course._id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <CardImg src={course.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {enrolling && (
                        <Button 
                          className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} float-end`}
                          onClick={(event) => {
                            event.preventDefault();
                            updateEnrollment(course._id, !course.enrolled);
                          }}
                        >
                          {course.enrolled ? "Unenroll" : "Enroll"}
                        </Button>
                      )}
                      {course.name}
                    </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description} </CardText>
                  </CardBody>
                </Link>
                <CardBody className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center">
                    {isEnrolled(course._id) ? (
                      <Link href={`/Courses/${course._id}/Home`}>
                        <Button variant="primary"> Go </Button>
                      </Link>
                    ) : (
                      <Button variant="primary" disabled> Go </Button>
                    )}
                    {isFaculty && (
                      <div className="d-flex gap-2">
                        <Button 
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning"
                          variant="warning"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button 
                          onClick={(event) => {
                            event.preventDefault();
                            handleDeleteCourse(course._id);
                          }} 
                          className="btn btn-danger"
                          id="wd-delete-course-click"
                          variant="danger"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

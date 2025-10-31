"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { enrollUserInCourse, unenrollUserFromCourse } from "../Enrollments/reducer";
import ProtectedRoute from "../Account/ProtectedRoute";

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
  
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  const isFaculty = currentUser?.role === "FACULTY";
  
  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (enrollment) => enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };
  
  const handleEnroll = (courseId: string) => {
    if (currentUser) {
      dispatch(enrollUserInCourse({ userId: currentUser._id, courseId }));
    }
  };
  
  const handleUnenroll = (courseId: string) => {
    if (currentUser) {
      dispatch(unenrollUserFromCourse({ userId: currentUser._id, courseId }));
    }
  };
  
  const addNewCourse = () => {
    dispatch(addCourse(course));
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
  };
  
  const handleDeleteCourse = (courseId: string) => {
    dispatch(deleteCourse(courseId));
  };
  
  const handleUpdateCourse = () => {
    dispatch(updateCourse(course));
  };
  
  // Filter courses based on showAllCourses toggle
  const filteredCourses = showAllCourses
    ? courses
    : courses.filter((course) => isEnrolled(course._id));

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowAllCourses(!showAllCourses)}
          className="mb-2"
        >
          {showAllCourses ? "My Courses" : "Enrollments"}
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
        {showAllCourses ? "All Courses" : "Published Courses"} ({filteredCourses.length})
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
                      {course.name} </CardTitle>
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
                  
                  {/* Enrollment buttons */}
                  {showAllCourses && (
                    <div className="d-flex justify-content-center">
                      {isEnrolled(course._id) ? (
                        <Button 
                          variant="danger" 
                          className="w-100"
                          onClick={(event) => {
                            event.preventDefault();
                            handleUnenroll(course._id);
                          }}
                        >
                          Unenroll
                        </Button>
                      ) : (
                        <Button 
                          variant="success" 
                          className="w-100"
                          onClick={(event) => {
                            event.preventDefault();
                            handleEnroll(course._id);
                          }}
                        >
                          Enroll
                        </Button>
                      )}
                    </div>
                  )}
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

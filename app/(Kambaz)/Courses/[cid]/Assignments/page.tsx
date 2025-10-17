"use client";

import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as db from "../../../Database";

export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments;

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="position-relative me-auto" style={{ width: "300px" }}>
          <IoSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
          <Form.Control type="text" placeholder="Search..." className="ps-5" />
        </div>
        <Button variant="secondary" size="lg" className="me-2">
          <BsPlus className="fs-4" /> Group
        </Button>
        <Button variant="danger" size="lg">
          <BsPlus className="fs-4" /> Assignment
        </Button>
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem className="p-3 ps-2 bg-secondary border-0">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <span className="fw-bold">▼ ASSIGNMENTS</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="border border-dark rounded-pill px-3 py-1 me-2 fs-6">40% of Total</span>
              <BsPlus className="fs-4 me-2" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
        </ListGroupItem>

        {assignments
          .filter((assignment) => assignment.course === cid)
          .map((assignment) => (
            <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
              <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-start w-100">
                  <BsGripVertical className="me-2 fs-3" />
                  <MdOutlineAssignment className="me-3 fs-4 text-success" />
                  <div className="flex-grow-1">
                    <Link href={`/Courses/${cid}/Assignments/${assignment._id}`} className="fw-bold text-dark text-decoration-none fs-5">
                      {assignment.title}
                    </Link>
                    <div className="text-muted small mt-1">
                      <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 6 at 12:00am | 
                    </div>
                    <div className="text-muted small">
                      <strong>Due</strong> May 13 at 11:59pm | 100 pts
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-start ms-2">
                  <FaCheckCircle className="text-success me-2 fs-5" />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}

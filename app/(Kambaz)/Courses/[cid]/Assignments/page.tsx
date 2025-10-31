"use client";

import { useState } from "react";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical, IoSearch } from "react-icons/io5";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdOutlineAssignment } from "react-icons/md";
import { Button, Form, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { deleteAssignment } from "../../Assignments/reducer";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableDate: string;
  availableUntil?: string;
  editing?: boolean;
}

interface RootState {
  assignmentsReducer: {
    assignments: Assignment[];
  };
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
}

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  
  const isFaculty = currentUser?.role === "FACULTY";
  
  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };
  
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments">
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="position-relative me-auto" style={{ width: "300px" }}>
          <IoSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
          <Form.Control type="text" placeholder="Search..." className="ps-5" />
        </div>
        {isFaculty && (
          <>
            <Button variant="secondary" size="lg" className="me-2">
              <BsPlus className="fs-4" /> Group
            </Button>
            <Link href={`/Courses/${cid}/Assignments/new`}>
              <Button variant="danger" size="lg">
                <BsPlus className="fs-4" /> Assignment
              </Button>
            </Link>
          </>
        )}
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
          .filter((assignment: Assignment) => assignment.course === cid)
          .map((assignment: Assignment) => (
            <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
              <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-start w-100">
                  <BsGripVertical className="me-2 fs-3" />
                  <MdOutlineAssignment className="me-3 fs-4 text-success" />
                  <div className="flex-grow-1">
                    <Link href={`/Courses/${cid}/Assignments/${assignment._id}/Editor`} className="fw-bold text-dark text-decoration-none fs-5">
                      {assignment.title}
                    </Link>
                    <div className="text-muted small mt-1">
                      <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> {new Date(assignment.availableDate).toLocaleDateString()} at 12:00am | 
                    </div>
                    <div className="text-muted small">
                      <strong>Due</strong> {new Date(assignment.dueDate).toLocaleDateString()} at 11:59pm | {assignment.points} pts
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-start ms-2">
                  <FaCheckCircle className="text-success me-2 fs-5" />
                  {isFaculty && (
                    <>
                      <FaPencil 
                        className="text-primary me-2 fs-5" 
                        onClick={() => router.push(`/Courses/${cid}/Assignments/${assignment._id}/Editor`)}
                        style={{ cursor: 'pointer' }}
                      />
                      <FaTrash 
                        className="text-danger me-2 fs-5" 
                        onClick={() => handleDeleteClick(assignment._id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </>
                  )}
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
            </ListGroupItem>
          ))}
      </ListGroup>

      {/* Delete Confirmation Dialog */}
      <Modal show={showDeleteDialog} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

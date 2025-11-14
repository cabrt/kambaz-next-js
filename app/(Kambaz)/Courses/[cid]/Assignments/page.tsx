"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, ListGroup, ListGroupItem, Modal, Form } from "react-bootstrap";
import { BsPlus, BsGripVertical } from "react-icons/bs";
import { FaTrash, FaPencil } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments, deleteAssignment } from "../../Assignments/reducer";
import * as assignmentsClient from "./client";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableDate: string;
  availableUntil?: string;
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
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchAssignments = useCallback(async () => {
    const assignments = await assignmentsClient.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  }, [cid, dispatch]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (assignmentToDelete) {
      await assignmentsClient.deleteAssignment(assignmentToDelete);
      dispatch(deleteAssignment(assignmentToDelete));
      setShowDeleteDialog(false);
      setAssignmentToDelete(null);
    }
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

      <ListGroup id="wd-assignments" className="rounded-0">
        {assignments.map((assignment: Assignment) => (
          <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <div className="flex-grow-1">
                <Link
                  className="wd-assignment-link text-decoration-none text-dark fw-bold"
                  href={`/Courses/${cid}/Assignments/${assignment._id}/Editor`}
                >
                  {assignment.title}
                </Link>
                <div className="text-muted">
                  <span className="text-danger">Multiple Modules</span> |{" "}
                  <strong>Not available until</strong> {assignment.availableDate} |
                </div>
                <div className="text-muted">
                  <strong>Due</strong> {assignment.dueDate} | {assignment.points} pts
                </div>
              </div>
              {isFaculty && (
                <div className="d-flex align-items-center">
                  <FaTrash
                    className="me-3 text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteClick(assignment._id)}
                  />
                  <Link href={`/Courses/${cid}/Assignments/${assignment._id}/Editor`}>
                    <FaPencil className="text-primary" style={{ cursor: "pointer" }} />
                  </Link>
                </div>
              )}
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>

      <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this assignment?</Modal.Body>
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

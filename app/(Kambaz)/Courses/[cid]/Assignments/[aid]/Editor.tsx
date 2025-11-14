"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../../../Assignments/reducer";
import * as assignmentsClient from "../client";

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

export default function AssignmentEditor() {
  const params = useParams();
  const cid = params.cid as string;
  const aid = params.aid as string;
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const isFaculty = currentUser?.role === "FACULTY";
  const isNewAssignment = aid === "new";
  const assignment = isNewAssignment ? null : assignments.find((a: Assignment) => a._id === aid);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntil: ""
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        points: assignment.points,
        dueDate: assignment.dueDate,
        availableDate: assignment.availableDate,
        availableUntil: assignment.availableUntil || ""
      });
    } else if (isNewAssignment) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      setFormData({
        title: "New Assignment",
        description: "",
        points: 100,
        dueDate: nextWeek.toISOString().slice(0, 16),
        availableDate: now.toISOString().slice(0, 16),
        availableUntil: nextWeek.toISOString().slice(0, 16)
      });
    }
  }, [assignment, isNewAssignment]);

  const handleSave = async () => {
    if (!isFaculty) return;
    
    if (isNewAssignment) {
      const newAssignment = await assignmentsClient.createAssignment(cid, formData);
      dispatch(addAssignment(newAssignment));
    } else if (assignment) {
      const updatedAssignment = await assignmentsClient.updateAssignment({
        ...assignment,
        ...formData,
      });
      dispatch(updateAssignment(updatedAssignment));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  if (!isFaculty) {
    return (
      <div id="wd-assignments-editor" className="p-3">
        <Alert variant="danger">
          You do not have permission to edit assignments.
        </Alert>
      </div>
    );
  }

  if (!isNewAssignment && !assignment) {
    return (
      <div id="wd-assignments-editor" className="p-3">
        <Alert variant="warning">
          Assignment not found.
        </Alert>
      </div>
    );
  }

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
          <Form.Control
            id="wd-name"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-description">Description</Form.Label>
          <Form.Control
            as="textarea"
            id="wd-description"
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-points">Points</Form.Label>
          <Form.Control
            type="number"
            id="wd-points"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-due-date">Due Date</Form.Label>
          <Form.Control
            type="datetime-local"
            id="wd-due-date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-available-from">Available From</Form.Label>
          <Form.Control
            type="datetime-local"
            id="wd-available-from"
            value={formData.availableDate}
            onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-available-until">Available Until</Form.Label>
          <Form.Control
            type="datetime-local"
            id="wd-available-until"
            value={formData.availableUntil}
            onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
          />
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}

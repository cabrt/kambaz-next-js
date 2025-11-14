"use client";

import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment } from "../../../../Assignments/reducer";
import * as assignmentsClient from "../../client";

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
}

export default function NewAssignmentEditor() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const isFaculty = currentUser?.role === "FACULTY";
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntil: ""
  });
  
  useEffect(() => {
    // Set default dates for new assignment
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
  }, []);
  
  const handleSave = async () => {
    if (!isFaculty) return;
    
    try {
      // Create new assignment on server
      const newAssignment = await assignmentsClient.createAssignment(cid as string, {
        title: formData.title,
        description: formData.description,
        points: formData.points,
        dueDate: formData.dueDate,
        availableDate: formData.availableDate,
        availableUntil: formData.availableUntil
      });
      
      // Add to Redux store
      dispatch(addAssignment(newAssignment));
      router.push(`/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Failed to create assignment:", error);
    }
  };
  
  if (!isFaculty) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>Only faculty members can create assignments.</p>
          <Link href={`/Courses/${cid}/Assignments`} className="btn btn-primary">
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id="wd-assignments-editor" className="container-fluid">
      <div className="mb-3">
        <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
        <Form.Control 
          id="wd-name" 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <Form.Control 
          as="textarea" 
          id="wd-description" 
          rows={10}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <Row className="mb-3">
        <Form.Label column sm={3} className="text-end">
          Points
        </Form.Label>
        <Col sm={9}>
          <Form.Control 
            id="wd-points" 
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3} className="text-end">
          Assignment Group
        </Form.Label>
        <Col sm={9}>
          <Form.Select id="wd-group" defaultValue="ASSIGNMENTS">
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="QUIZZES">QUIZZES</option>
            <option value="EXAMS">EXAMS</option>
            <option value="PROJECT">PROJECT</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3} className="text-end">
          Display Grade as
        </Form.Label>
        <Col sm={9}>
          <Form.Select id="wd-display-grade-as" defaultValue="Percentage">
            <option value="Percentage">Percentage</option>
            <option value="Points">Points</option>
            <option value="Letter Grade">Letter Grade</option>
            <option value="GPA Scale">GPA Scale</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3} className="text-end">
          Submission Type
        </Form.Label>
        <Col sm={9}>
          <div className="border p-3">
            <Form.Select id="wd-submission-type" defaultValue="Online" className="mb-3">
              <option value="Online">Online</option>
              <option value="Paper">Paper</option>
              <option value="External Tool">External Tool</option>
            </Form.Select>

            <div>
              <strong>Online Entry Options</strong>
              <Form.Check 
                type="checkbox" 
                id="wd-text-entry" 
                label="Text Entry" 
                className="mt-2"
              />
              <Form.Check 
                type="checkbox" 
                id="wd-website-url" 
                label="Website URL" 
                defaultChecked
              />
              <Form.Check 
                type="checkbox" 
                id="wd-media-recordings" 
                label="Media Recordings" 
              />
              <Form.Check 
                type="checkbox" 
                id="wd-student-annotation" 
                label="Student Annotation" 
              />
              <Form.Check 
                type="checkbox" 
                id="wd-file-upload" 
                label="File Uploads" 
              />
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column sm={3} className="text-end">
          Assign
        </Form.Label>
        <Col sm={9}>
          <div className="border p-3">
            <div className="mb-3">
              <Form.Label htmlFor="wd-assign-to" className="fw-bold">Assign to</Form.Label>
              <div className="border p-2 bg-white">
                <span className="badge bg-light text-dark border me-2">
                  Everyone <button type="button" className="btn-close btn-close-sm ms-2" style={{ fontSize: "0.6rem" }}></button>
                </span>
              </div>
            </div>

            <div className="mb-3">
              <Form.Label htmlFor="wd-due-date" className="fw-bold">Due</Form.Label>
              <Form.Control 
                type="datetime-local" 
                id="wd-due-date" 
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    id="wd-available-from" 
                    value={formData.availableDate}
                    onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">Until</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    id="wd-available-until" 
                    value={formData.availableUntil}
                    onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="d-flex justify-content-end mt-3">
        <Link href={`/Courses/${cid}/Assignments`} className="btn btn-secondary me-2">
          Cancel
        </Link>
        <Button 
          onClick={handleSave}
          className="btn btn-danger"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

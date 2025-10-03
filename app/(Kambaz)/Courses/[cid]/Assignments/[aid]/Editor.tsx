import { Form, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="container-fluid">
      <div className="mb-3">
        <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
        <Form.Control id="wd-name" defaultValue="A1" />
      </div>

      <div className="mb-3">
        <Form.Control 
          as="textarea" 
          id="wd-description" 
          rows={10}
          defaultValue={`The assignment is available online

Submit a link to the landing page of your Web application...`}
        />
      </div>

      <Row className="mb-3">
        <Form.Label column sm={3} className="text-end">
          Points
        </Form.Label>
        <Col sm={9}>
          <Form.Control id="wd-points" defaultValue={100} />
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
                defaultValue="2024-05-13T23:59"
              />
            </div>

            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">Available from</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    id="wd-available-from" 
                    defaultValue="2024-05-06T00:00"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">Until</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    id="wd-available-until" 
                    defaultValue="2024-05-20T23:59"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" className="me-2">Cancel</Button>
        <Button variant="danger">Save</Button>
      </div>
    </div>
  );
}

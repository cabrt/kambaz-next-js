"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Alert, Nav, Tab } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as quizzesClient from "../../client";

interface Quiz {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableDate?: string;
  availableUntil?: string;
  published?: boolean;
  questionCount?: number;
  quizType?: string;
  assignmentGroup?: string;
  shuffleAnswers?: boolean;
  timeLimit?: number;
  multipleAttempts?: boolean;
  attemptsAllowed?: number;
  showCorrectAnswers?: string;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
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
}

export default function QuizEditor() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const router = useRouter();
  
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isNewQuiz = qid === "new";
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(!isNewQuiz);
  const [activeTab, setActiveTab] = useState("details");

  // Format dates for datetime-local inputs
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    // Convert to local datetime string in format YYYY-MM-DDTHH:mm
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntil: "",
    published: false,
    questionCount: 0,
    quizType: "Graded Quiz",
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    attemptsAllowed: 1,
    showCorrectAnswers: "Immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!isNewQuiz && qid) {
        try {
          setLoading(true);
          const fetchedQuiz = await quizzesClient.findQuizById(qid);
          setQuiz(fetchedQuiz);
        } catch (error) {
          console.error("Failed to fetch quiz:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQuiz();
  }, [qid, isNewQuiz]);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title,
        description: quiz.description || "",
        points: quiz.points || 100,
        dueDate: formatDateForInput(quiz.dueDate),
        availableDate: formatDateForInput(quiz.availableDate),
        availableUntil: formatDateForInput(quiz.availableUntil),
        published: quiz.published || false,
        questionCount: quiz.questionCount || 0,
        quizType: quiz.quizType || "Graded Quiz",
        assignmentGroup: quiz.assignmentGroup || "QUIZZES",
        shuffleAnswers: quiz.shuffleAnswers !== false,
        timeLimit: quiz.timeLimit || 20,
        multipleAttempts: quiz.multipleAttempts || false,
        attemptsAllowed: quiz.attemptsAllowed || 1,
        showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
        accessCode: quiz.accessCode || "",
        oneQuestionAtATime: quiz.oneQuestionAtATime !== false,
        webcamRequired: quiz.webcamRequired || false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
      });
    } else if (isNewQuiz) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      setFormData({
        title: "New Quiz",
        description: "",
        points: 100,
        dueDate: formatDateForInput(nextWeek),
        availableDate: formatDateForInput(now),
        availableUntil: formatDateForInput(nextWeek),
        published: false,
        questionCount: 0,
        quizType: "Graded Quiz",
        assignmentGroup: "QUIZZES",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        attemptsAllowed: 1,
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
      });
    }
  }, [quiz, isNewQuiz]);

  const handleSave = async () => {
    if (!isFaculty) return;
    
    try {
      if (isNewQuiz) {
        const newQuiz = await quizzesClient.createQuiz(cid, formData);
        router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}`);
      } else if (quiz) {
        await quizzesClient.updateQuiz({
          ...quiz,
          ...formData,
        });
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!isFaculty) return;
    
    try {
      const dataToSave = { ...formData, published: true };
      if (isNewQuiz) {
        await quizzesClient.createQuiz(cid, dataToSave);
        router.push(`/Courses/${cid}/Quizzes`);
      } else if (quiz) {
        await quizzesClient.updateQuiz({
          ...quiz,
          ...dataToSave,
        });
        router.push(`/Courses/${cid}/Quizzes`);
      }
    } catch (error) {
      console.error("Failed to save and publish quiz:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return (
      <div id="wd-quiz-editor" className="p-3">
        <Alert variant="info">Loading quiz...</Alert>
      </div>
    );
  }

  if (!isNewQuiz && !quiz) {
    return (
      <div id="wd-quiz-editor" className="p-3">
        <Alert variant="warning">
          Quiz not found.
        </Alert>
      </div>
    );
  }

  if (!isFaculty) {
    return (
      <div id="wd-quiz-editor" className="p-3">
        <Alert variant="danger">
          You do not have permission to edit quizzes.
        </Alert>
      </div>
    );
  }

  return (
    <div id="wd-quiz-editor" className="p-3">
      <style>{`
        #wd-quiz-editor .nav-link {
          color: #dc3545 !important;
        }
        #wd-quiz-editor .nav-link.active {
          color: #fff !important;
          background-color: #dc3545 !important;
          border-color: #dc3545 !important;
        }
        #wd-quiz-editor .nav-link:hover {
          color: #dc3545 !important;
          border-color: #dc3545 !important;
        }
      `}</style>
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="details">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="wd-quiz-title">Quiz Name</Form.Label>
                <Form.Control
                  id="wd-quiz-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-description">Description</Form.Label>
          <Form.Control
            as="textarea"
            id="wd-quiz-description"
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-points">Points</Form.Label>
          <Form.Control
            type="number"
            id="wd-quiz-points"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-question-count">Number of Questions</Form.Label>
          <Form.Control
            type="number"
            id="wd-quiz-question-count"
            value={formData.questionCount}
            onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 0 })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-due-date">Due Date</Form.Label>
          <Form.Control
            type="datetime-local"
            id="wd-quiz-due-date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-available-from">Available From</Form.Label>
          <Form.Control
            type="datetime-local"
            id="wd-quiz-available-from"
            value={formData.availableDate}
            onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-available-until">Available Until</Form.Label>
          <Form.Control
            type="datetime-local"
            id="wd-quiz-available-until"
            value={formData.availableUntil}
            onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
          />
        </Form.Group>

        <hr className="my-4" />
        <h5 className="mb-3">Quiz Settings</h5>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-type">Quiz Type</Form.Label>
          <Form.Select
            id="wd-quiz-type"
            value={formData.quizType}
            onChange={(e) => setFormData({ ...formData, quizType: e.target.value })}
          >
            <option value="Graded Quiz">Graded Quiz</option>
            <option value="Practice Quiz">Practice Quiz</option>
            <option value="Graded Survey">Graded Survey</option>
            <option value="Ungraded Survey">Ungraded Survey</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-assignment-group">Assignment Group</Form.Label>
          <Form.Select
            id="wd-quiz-assignment-group"
            value={formData.assignmentGroup}
            onChange={(e) => setFormData({ ...formData, assignmentGroup: e.target.value })}
          >
            <option value="QUIZZES">QUIZZES</option>
            <option value="EXAMS">EXAMS</option>
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="PROJECT">PROJECT</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="wd-quiz-shuffle-answers"
            label="Shuffle Answers"
            checked={formData.shuffleAnswers}
            onChange={(e) => setFormData({ ...formData, shuffleAnswers: e.target.checked })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-time-limit">Time Limit (Minutes)</Form.Label>
          <Form.Control
            type="number"
            id="wd-quiz-time-limit"
            value={formData.timeLimit}
            onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 20 })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="wd-quiz-multiple-attempts"
            label="Multiple Attempts"
            checked={formData.multipleAttempts}
            onChange={(e) => setFormData({ ...formData, multipleAttempts: e.target.checked })}
          />
        </Form.Group>

        {formData.multipleAttempts && (
          <Form.Group className="mb-3">
            <Form.Label htmlFor="wd-quiz-attempts-allowed">How Many Attempts</Form.Label>
            <Form.Control
              type="number"
              id="wd-quiz-attempts-allowed"
              value={formData.attemptsAllowed}
              onChange={(e) => setFormData({ ...formData, attemptsAllowed: parseInt(e.target.value) || 1 })}
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-show-correct-answers">Show Correct Answers</Form.Label>
          <Form.Select
            id="wd-quiz-show-correct-answers"
            value={formData.showCorrectAnswers}
            onChange={(e) => setFormData({ ...formData, showCorrectAnswers: e.target.value })}
          >
            <option value="Immediately">Immediately</option>
            <option value="After Due Date">After Due Date</option>
            <option value="Never">Never</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-quiz-access-code">Access Code</Form.Label>
          <Form.Control
            type="text"
            id="wd-quiz-access-code"
            value={formData.accessCode}
            onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
            placeholder="(blank)"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="wd-quiz-one-question-at-a-time"
            label="One Question at a Time"
            checked={formData.oneQuestionAtATime}
            onChange={(e) => setFormData({ ...formData, oneQuestionAtATime: e.target.checked })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="wd-quiz-webcam-required"
            label="Webcam Required"
            checked={formData.webcamRequired}
            onChange={(e) => setFormData({ ...formData, webcamRequired: e.target.checked })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="wd-quiz-lock-questions"
            label="Lock Questions After Answering"
            checked={formData.lockQuestionsAfterAnswering}
            onChange={(e) => setFormData({ ...formData, lockQuestionsAfterAnswering: e.target.checked })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="wd-quiz-published"
            label="Published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          />
        </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="danger" onClick={handleSaveAndPublish}>
                  Save and Publish
                </Button>
              </div>
            </Form>
          </Tab.Pane>

          <Tab.Pane eventKey="questions">
            <div className="p-3">
              <div className="d-flex justify-content-end mb-3">
                <Button 
                  variant="danger" 
                  onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor/Questions`)}
                >
                  Go to Questions Editor
                </Button>
              </div>
              <p>Click the button above to navigate to the Questions Editor screen where you can add, edit, and manage quiz questions.</p>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}


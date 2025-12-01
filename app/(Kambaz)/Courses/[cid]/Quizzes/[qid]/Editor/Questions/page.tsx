"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, ListGroup, ListGroupItem, Badge, Dropdown, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaTrash, FaPlus } from "react-icons/fa";
import { FaPencil as FaPencilIcon } from "react-icons/fa6";
import * as questionsClient from "./client";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillInBlankEditor from "./FillInBlankEditor";

interface Question {
  _id: string;
  quiz: string;
  title: string;
  questionType: "Multiple Choice" | "True/False" | "Fill in the Blank";
  points: number;
  question: string;
  choices?: string[];
  correctChoice?: number;
  correctAnswer?: boolean;
  possibleAnswers?: string[];
  caseSensitive?: boolean;
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

export default function QuizQuestionsEditor() {
  const params = useParams();
  const cid = params.cid as string;
  const qid = params.qid as string;
  const router = useRouter();
  
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [loading, setLoading] = useState(true);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching questions for quiz ID:", qid);
      if (!qid) {
        console.error("Quiz ID is missing!");
        return;
      }
      const fetchedQuestions = await questionsClient.findQuestionsForQuiz(qid);
      setQuestions(fetchedQuestions);
    } catch (error: unknown) {
      console.error("Failed to fetch questions:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        console.error("Error response:", axiosError.response?.status, axiosError.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }, [qid]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleNewQuestion = (questionType: "Multiple Choice" | "True/False" | "Fill in the Blank" = "Multiple Choice") => {
    const baseQuestion: Question = {
      _id: "new",
      quiz: qid,
      title: "New Question",
      questionType,
      points: 0,
      question: "",
    };

    if (questionType === "Multiple Choice") {
      baseQuestion.choices = ["", ""];
      baseQuestion.correctChoice = 0;
    } else if (questionType === "True/False") {
      baseQuestion.correctAnswer = true;
    } else if (questionType === "Fill in the Blank") {
      baseQuestion.possibleAnswers = [""];
      baseQuestion.caseSensitive = false;
    }

    setEditingQuestion(baseQuestion);
    setIsNewQuestion(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsNewQuestion(false);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setIsNewQuestion(false);
  };

  const handleSaveQuestion = async (question: Question) => {
    try {
      if (isNewQuestion) {
        console.log("Creating new question for quiz:", qid);
        await questionsClient.createQuestion(qid, question);
      } else {
        console.log("Updating question:", question._id);
        await questionsClient.updateQuestion(question);
      }
      setEditingQuestion(null);
      setIsNewQuestion(false);
      await fetchQuestions();
    } catch (error: unknown) {
      console.error("Failed to save question:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
        console.error("Error response:", axiosError.response?.status, axiosError.response?.data);
        alert(`Failed to save question: ${axiosError.response?.data?.message || axiosError.message || "Unknown error"}`);
      } else if (error instanceof Error) {
        alert(`Failed to save question: ${error.message || "Unknown error"}`);
      } else {
        alert("Failed to save question: Unknown error");
      }
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await questionsClient.deleteQuestion(questionId);
        await fetchQuestions();
      } catch (error) {
        console.error("Failed to delete question:", error);
      }
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  if (!isFaculty) {
    return (
      <div className="p-3">
        <p>You do not have permission to edit quiz questions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-3">
        <p>Loading questions...</p>
      </div>
    );
  }

  const handleQuestionTypeChange = (newType: "Multiple Choice" | "True/False" | "Fill in the Blank") => {
    if (!editingQuestion) return;
    
    const baseQuestion: Question = {
      ...editingQuestion,
      questionType: newType,
    };

    // Reset type-specific fields when changing type
    if (newType === "Multiple Choice") {
      baseQuestion.choices = editingQuestion.choices && editingQuestion.choices.length > 0 
        ? editingQuestion.choices 
        : ["", ""];
      baseQuestion.correctChoice = editingQuestion.correctChoice ?? 0;
      delete baseQuestion.correctAnswer;
      delete baseQuestion.possibleAnswers;
      delete baseQuestion.caseSensitive;
    } else if (newType === "True/False") {
      baseQuestion.correctAnswer = editingQuestion.correctAnswer ?? true;
      delete baseQuestion.choices;
      delete baseQuestion.correctChoice;
      delete baseQuestion.possibleAnswers;
      delete baseQuestion.caseSensitive;
    } else if (newType === "Fill in the Blank") {
      baseQuestion.possibleAnswers = editingQuestion.possibleAnswers && editingQuestion.possibleAnswers.length > 0
        ? editingQuestion.possibleAnswers
        : [""];
      baseQuestion.caseSensitive = editingQuestion.caseSensitive ?? false;
      delete baseQuestion.choices;
      delete baseQuestion.correctChoice;
      delete baseQuestion.correctAnswer;
    }

    setEditingQuestion(baseQuestion);
  };

  if (editingQuestion) {
    return (
      <div className="p-3">
        <div className="mb-3">
          <Form.Label><strong>Question Type:</strong></Form.Label>
          <Form.Select
            value={editingQuestion.questionType}
            onChange={(e) => handleQuestionTypeChange(e.target.value as Question["questionType"])}
            style={{ width: "auto", display: "inline-block" }}
          >
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="True/False">True/False</option>
            <option value="Fill in the Blank">Fill in the Blank</option>
          </Form.Select>
        </div>
        {editingQuestion.questionType === "Multiple Choice" && (
          <MultipleChoiceEditor
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        )}
        {editingQuestion.questionType === "True/False" && (
          <TrueFalseEditor
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        )}
        {editingQuestion.questionType === "Fill in the Blank" && (
          <FillInBlankEditor
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Quiz Questions</h2>
          <p className="text-muted mb-0">Total Points: <strong>{totalPoints}</strong></p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}>
            Back to Editor
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="danger">
              <FaPlus className="me-1" /> New Question
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleNewQuestion("Multiple Choice")}>
                Multiple Choice
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleNewQuestion("True/False")}>
                True/False
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleNewQuestion("Fill in the Blank")}>
                Fill in the Blank
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <p className="mb-3">No questions yet. Click &quot;New Question&quot; to add your first question.</p>
        </div>
      ) : (
        <ListGroup>
          {questions.map((question, index) => (
            <ListGroupItem key={question._id} className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg="secondary">{index + 1}</Badge>
                  <strong>{question.title || "Untitled Question"}</strong>
                  <Badge bg="info">{question.questionType}</Badge>
                  <Badge bg="success">{question.points} pts</Badge>
                </div>
                <div 
                  className="text-muted small"
                  dangerouslySetInnerHTML={{ __html: question.question || "No question text" }}
                />
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEditQuestion(question)}
                >
                  <FaPencilIcon className="me-1" /> Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteQuestion(question._id)}
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

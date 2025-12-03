"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { BsPlus, BsGripVertical } from "react-icons/bs";
import { FaRocket, FaCheck, FaEllipsisV, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import * as quizzesClient from "./client";
import * as attemptsClient from "./[qid]/Take/client";

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

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isQuizzesExpanded, setIsQuizzesExpanded] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; totalPoints: number }>>({});

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu) {
        setShowContextMenu(null);
      }
    };
    if (showContextMenu) {
      setTimeout(() => document.addEventListener("click", handleClickOutside), 0);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showContextMenu]);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const fetchQuizzes = useCallback(async () => {
    try {
      const fetchedQuizzes = await quizzesClient.findQuizzesForCourse(cid as string);
      setQuizzes(fetchedQuizzes);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      setQuizzes([]);
    }
  }, [cid]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Fetch latest attempt scores for students
  useEffect(() => {
    if (!isFaculty && quizzes.length > 0) {
      const fetchScores = async () => {
        const scores: Record<string, { score: number; totalPoints: number }> = {};
        for (const quiz of quizzes) {
          if (quiz.published) {
            try {
              const attempt = await attemptsClient.findLatestAttempt(quiz._id);
              if (attempt && attempt.submittedAt) {
                scores[quiz._id] = {
                  score: attempt.score,
                  totalPoints: attempt.totalPoints
                };
              }
            } catch {
              // No attempt found or error - ignore
            }
          }
        }
        setQuizScores(scores);
      };
      fetchScores();
    }
  }, [quizzes, isFaculty]);

  const handleAddQuiz = async () => {
    try {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const newQuiz = await quizzesClient.createQuiz(cid as string, {
        title: "New Quiz",
        description: "",
        points: 100,
        dueDate: nextWeek.toISOString(),
        availableDate: now.toISOString(),
        availableUntil: nextWeek.toISOString(),
        published: false,
        questionCount: 0,
      });
      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/Editor`);
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setShowDeleteDialog(true);
    setShowContextMenu(null);
  };

  const handleConfirmDelete = async () => {
    if (quizToDelete) {
      try {
        await quizzesClient.deleteQuiz(quizToDelete);
        await fetchQuizzes();
        setShowDeleteDialog(false);
        setQuizToDelete(null);
      } catch (error) {
        console.error("Failed to delete quiz:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handleEdit = (quizId: string) => {
    router.push(`/Courses/${cid}/Quizzes/${quizId}/Editor`);
    setShowContextMenu(null);
  };

  const handlePublish = async (quiz: Quiz) => {
    try {
      const updatedQuiz = { ...quiz, published: !quiz.published };
      await quizzesClient.updateQuiz(updatedQuiz);
      await fetchQuizzes();
      setShowContextMenu(null);
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };


  const getAvailabilityStatus = (quiz: Quiz): string => {
    if (!quiz.availableDate) return "Not available";
    const now = new Date();
    const availableDate = new Date(quiz.availableDate);
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

    // Closed - if current date is after Available Until Date
    if (availableUntil && now > availableUntil) {
      return "Closed";
    }
    
    // Not available until - if current date is before Available Date
    if (now < availableDate) {
      return `Not available until ${formatDate(quiz.availableDate)}`;
    }
    
    // Available - if current date is between Available Date and Available Until Date
    return "Available";
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${month} ${day} at ${displayHours}:${displayMinutes}${ampm}`;
  };

  return (
    <div id="wd-quizzes">
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="position-relative me-auto" style={{ width: "300px" }}>
          <IoSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
          <input 
            type="text" 
            placeholder="Search for Quiz" 
            className="form-control ps-5"
          />
        </div>
        {isFaculty && (
          <Button variant="danger" size="lg" onClick={handleAddQuiz}>
            <BsPlus className="fs-4" /> Quiz
          </Button>
        )}
      </div>

      <ListGroup className="rounded-0 mb-3">
        <ListGroupItem 
          style={{ backgroundColor: "#f5f5f5", border: "1px solid #dee2e6", cursor: "pointer" }}
          onClick={() => setIsQuizzesExpanded(!isQuizzesExpanded)}
        >
          <div className="d-flex align-items-center">
            <span style={{ marginRight: "8px", fontSize: "14px" }}>
              {isQuizzesExpanded ? "▾" : "▸"}
            </span>
            <strong>Assignment Quizzes</strong>
      </div>
        </ListGroupItem>
      </ListGroup>

      {isQuizzesExpanded && (
        <>
          {(() => {
            // Filter quizzes: students only see published quizzes, faculty see all
            const visibleQuizzes = isFaculty ? quizzes : quizzes.filter(quiz => quiz.published);
            
            return visibleQuizzes.length === 0 ? (
        <div className="text-center p-5">
          <p>No quizzes yet. {isFaculty && "Click the + Quiz button to create a new quiz."}</p>
        </div>
      ) : (
        <ListGroup id="wd-quizzes-list" className="rounded-0">
                {visibleQuizzes.map((quiz) => (
                <ListGroupItem key={quiz._id} className="wd-quiz-item p-0 border-start-0 border-end-0">
              <div className="d-flex align-items-center position-relative">
                {/* Green bar on the left */}
                <div 
                      className="bg-success" 
                  style={{ 
                        width: "5px", 
                    height: "100%", 
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0
                  }} 
                />
                    <div className="d-flex align-items-center flex-grow-1 py-3 ps-4">
                      <BsGripVertical className="me-2 fs-3" />
                      <FaRocket className="me-3 text-success" />
                      <div className="flex-grow-1">
                    <Link
                      href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                          className="wd-quiz-link text-decoration-none text-dark fw-bold"
                    >
                      {quiz.title}
                    </Link>
                        <div className="text-muted mt-1">
                          <strong>Availability:</strong> {getAvailabilityStatus(quiz)}
                          {" | "}
                          <strong>Due:</strong> {formatDate(quiz.dueDate)}
                          {" | "}
                          <strong>Points:</strong> {quiz.points || 0}
                          {" | "}
                          <strong>Number of questions:</strong> {quiz.questionCount || 0}
                          {!isFaculty && quizScores[quiz._id] && (
                            <>
                              {" | "}
                              <strong>Score:</strong> {quizScores[quiz._id].score} / {quizScores[quiz._id].totalPoints}
                            </>
                          )}
                    </div>
                  </div>
                      {/* Green checkmark on the right */}
                <div className="d-flex align-items-center me-3">
                  {isFaculty ? (
                    <span
                            style={{ 
                              cursor: "pointer",
                              width: "24px",
                              height: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                              backgroundColor: quiz.published ? "#28a745" : "rgba(40, 167, 69, 0.3)",
                              transition: "background-color 0.2s"
                            }}
                      onClick={() => handlePublish(quiz)}
                      title={quiz.published ? "Click to unpublish" : "Click to publish"}
                    >
                      <FaCheck 
                              className="text-white" 
                              style={{ fontSize: "12px" }} 
                      />
                    </span>
                  ) : (
                          quiz.published && (
                            <span
                      style={{ 
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%",
                                backgroundColor: "#28a745"
                              }}
                            >
                              <FaCheck 
                                className="text-white" 
                                style={{ fontSize: "12px" }} 
                    />
                            </span>
                          )
                  )}
                </div>
                      {/* Three-dot menu */}
                {isFaculty && (
                        <div className="d-flex align-items-center position-relative me-3">
                    <button
                            className="btn btn-link p-1"
                            style={{ color: "#666", border: "none", background: "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowContextMenu(showContextMenu === quiz._id ? null : quiz._id);
                      }}
                    >
                            <FaEllipsisV style={{ fontSize: "16px" }} />
                    </button>
                    {showContextMenu === quiz._id && (
                      <div 
                              className="position-absolute bg-white border rounded shadow-sm" 
                              style={{ 
                                zIndex: 1000, 
                                minWidth: "150px",
                                top: "100%",
                                right: 0,
                                marginTop: "5px"
                              }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                                className="dropdown-item d-block w-100 text-start px-3 py-2 border-0 bg-transparent"
                                style={{ fontSize: "14px" }}
                          onClick={() => handleEdit(quiz._id)}
                        >
                                <FaPencil className="me-2" style={{ fontSize: "12px" }} /> Edit
                        </button>
                        <button
                                className="dropdown-item d-block w-100 text-start px-3 py-2 border-0 bg-transparent"
                                style={{ fontSize: "14px" }}
                          onClick={() => handlePublish(quiz)}
                        >
                          {quiz.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                                className="dropdown-item d-block w-100 text-start px-3 py-2 border-0 bg-transparent text-danger"
                                style={{ fontSize: "14px" }}
                          onClick={() => handleDeleteClick(quiz._id)}
                        >
                                <FaTrash className="me-2" style={{ fontSize: "12px" }} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                    </div>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
            );
          })()}
        </>
      )}

      <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this quiz?</Modal.Body>
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

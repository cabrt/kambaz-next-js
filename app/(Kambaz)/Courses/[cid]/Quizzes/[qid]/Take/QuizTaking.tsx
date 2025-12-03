"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { Question } from "../Editor/Questions/client";
import { QuizAttempt } from "./client";

interface Quiz {
  _id: string;
  title: string;
  timeLimit?: number;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  [key: string]: unknown;
}

interface QuizTakingProps {
  quiz: Quiz;
  questions: Question[];
  attempt: QuizAttempt | null;
  onSubmit: (answers: Array<{ question: string; answer: string | number | boolean }>) => void;
  isPreview?: boolean;
  showAllQuestions?: boolean;
  previousAttempt?: QuizAttempt | null;
}

export default function QuizTaking({ quiz, questions, attempt, onSubmit, showAllQuestions, previousAttempt }: QuizTakingProps) {
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [webcamApproved, setWebcamApproved] = useState<boolean>(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Use previousAttempt for review mode, otherwise use current attempt
    const attemptToUse = showAllQuestions && previousAttempt ? previousAttempt : attempt;
    
    if (attemptToUse && attemptToUse.answers && attemptToUse.answers.length > 0) {
      const answerMap: Record<string, string | number | boolean> = {};
      const answered = new Set<string>();
      attemptToUse.answers.forEach((a) => {
        answerMap[a.question] = a.answer;
        answered.add(a.question);
      });
      setAnswers(answerMap);
      setAnsweredQuestions(answered);
    } else {
      // Reset answered questions when starting a new attempt
      setAnsweredQuestions(new Set());
    }
    // Reset question index when starting a new attempt
    if (attempt && !attempt.submittedAt) {
      setCurrentQuestionIndex(0);
    }
  }, [attempt, showAllQuestions, previousAttempt]); // Reset when attempt changes (new attempt)

  // Reset question index when questions change
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(0);
    }
  }, [questions.length, currentQuestionIndex]);

  // Request webcam approval if required
  useEffect(() => {
    const isSubmitted = attempt?.submittedAt !== undefined;
    if (quiz.webcamRequired && !attempt?.submittedAt && !isSubmitted && !webcamApproved) {
      const requestWebcamApproval = () => {
        const approved = window.confirm(
          "You're webcam must be turned on for this quiz (Don't worry, it won't actually, but if you say no it won't let you take the quiz)"
        );
        if (approved) {
          setWebcamApproved(true);
        } else {
          // User declined - they won't be able to take the quiz
          setWebcamApproved(false);
        }
      };
      requestWebcamApproval();
    }
  }, [quiz.webcamRequired, attempt?.submittedAt, webcamApproved]);

  useEffect(() => {
    if (quiz.timeLimit && !attempt?.submittedAt) {
      const startTime = attempt?.startedAt ? new Date(attempt.startedAt).getTime() : Date.now();
      const timeLimitMs = quiz.timeLimit * 60 * 1000;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, timeLimitMs - elapsed);
      setTimeRemaining(Math.floor(remaining / 1000));

      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quiz.timeLimit, attempt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | number | boolean) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Lock the current question if lockQuestionsAfterAnswering is enabled and it has an answer
      if (quiz.lockQuestionsAfterAnswering && !isSubmitted) {
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = answers[currentQuestion._id];
        // Check if question has been answered
        if (currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "") {
          // For Fill in the Blank, check if non-empty string
          if (typeof currentAnswer === "string") {
            if (currentAnswer.trim() !== "") {
              setAnsweredQuestions(prev => new Set(prev).add(currentQuestion._id));
            }
          } else {
            // Multiple Choice or True/False - has an answer
            setAnsweredQuestions(prev => new Set(prev).add(currentQuestion._id));
          }
        }
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Lock the current question if lockQuestionsAfterAnswering is enabled and it has an answer
      if (quiz.lockQuestionsAfterAnswering && !isSubmitted) {
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = answers[currentQuestion._id];
        // Check if question has been answered
        if (currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "") {
          // For Fill in the Blank, check if non-empty string
          if (typeof currentAnswer === "string") {
            if (currentAnswer.trim() !== "") {
              setAnsweredQuestions(prev => new Set(prev).add(currentQuestion._id));
            }
          } else {
            // Multiple Choice or True/False - has an answer
            setAnsweredQuestions(prev => new Set(prev).add(currentQuestion._id));
          }
        }
      }
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const answerArray = Object.entries(answers).map(([question, answer]) => ({
      question,
      answer,
    }));
    onSubmit(answerArray);
  };

  const isSubmitted = attempt?.submittedAt !== undefined;
  // Default to true if not specified (undefined means true)
  const oneQuestionAtATime = quiz.oneQuestionAtATime !== false;
  // If lockQuestionsAfterAnswering is true, hide answers after submission
  const showAnswers = !quiz.lockQuestionsAfterAnswering || !isSubmitted;
  
  // Show all questions if showAllQuestions is true (for review before retake) or if quiz is submitted
  const shouldShowAllQuestions = showAllQuestions || isSubmitted;
  
  // Check if a question is locked (answered and lockQuestionsAfterAnswering is enabled)
  const isQuestionLocked = (questionId: string) => {
    return quiz.lockQuestionsAfterAnswering && answeredQuestions.has(questionId) && !isSubmitted;
  };
  
  // Ensure currentQuestionIndex is within bounds
  const safeQuestionIndex = questions.length > 0 
    ? Math.min(Math.max(0, currentQuestionIndex), questions.length - 1)
    : 0;
  
  // If showing all questions (review mode or submitted), show all. Otherwise, respect oneQuestionAtATime
  const displayQuestions = (shouldShowAllQuestions || !oneQuestionAtATime) && questions.length > 0 
    ? questions 
    : oneQuestionAtATime && questions.length > 0 
      ? [questions[safeQuestionIndex]] 
      : questions;
  
  // Use previous attempt's answers for display if in review mode
  const displayAttempt = showAllQuestions && previousAttempt ? previousAttempt : attempt;

  return (
    <div className="p-3">
      {timeRemaining !== null && timeRemaining > 0 && !isSubmitted && (
        <Alert variant="info" className="mb-3">
          <strong>Time Remaining:</strong> {formatTime(timeRemaining)}
        </Alert>
      )}

      {quiz.webcamRequired && !webcamApproved && !isSubmitted && (
        <Alert variant="danger" className="mb-3">
          <strong>Webcam Required:</strong> You must approve webcam access to take this quiz. Please refresh the page and approve when prompted.
        </Alert>
      )}

      {oneQuestionAtATime && !isSubmitted && !shouldShowAllQuestions && questions.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <strong>Question {safeQuestionIndex + 1} of {questions.length}</strong>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={handlePreviousQuestion}
              disabled={safeQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              disabled={safeQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {displayQuestions.map((question, index) => {
        const actualIndex = oneQuestionAtATime ? safeQuestionIndex : index;
        
        return (
          <Card key={question._id} className="mb-3">
            <Card.Header>
              <strong>Question {actualIndex + 1}</strong> ({question.points} points)
              {isSubmitted && displayAttempt && showAnswers && (
                <span className={`ms-2 ${displayAttempt.answers.find(a => a.question === question._id)?.isCorrect ? "text-success" : "text-danger"}`}>
                  {displayAttempt.answers.find(a => a.question === question._id)?.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
              )}
            </Card.Header>
            <Card.Body>
              <div
                className="mb-3"
                dangerouslySetInnerHTML={{ __html: question.question || "" }}
              />

              {question.questionType === "Multiple Choice" && (
                <div>
                  {question.choices?.map((choice: string, choiceIndex: number) => (
                    <Form.Check
                      key={choiceIndex}
                      type="radio"
                      name={`question-${question._id}`}
                      id={`question-${question._id}-choice-${choiceIndex}`}
                      label={choice}
                      checked={answers[question._id] === choiceIndex}
                      onChange={() => handleAnswerChange(question._id, choiceIndex)}
                      disabled={isSubmitted || (quiz.webcamRequired && !webcamApproved) || isQuestionLocked(question._id) || shouldShowAllQuestions}
                      className={isSubmitted && showAnswers && displayAttempt?.answers.find(a => a.question === question._id && a.answer === choiceIndex)?.isCorrect ? "text-success" : ""}
                    />
                  ))}
                  {isSubmitted && displayAttempt && showAnswers && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Correct answer: {question.choices?.[question.correctChoice || 0]}
                      </small>
                    </div>
                  )}
                </div>
              )}

              {question.questionType === "True/False" && (
                <div>
                  <Form.Check
                    type="radio"
                    name={`question-${question._id}`}
                    id={`question-${question._id}-true`}
                    label="True"
                    checked={answers[question._id] === true}
                    onChange={() => handleAnswerChange(question._id, true)}
                    disabled={isSubmitted || (quiz.webcamRequired && !webcamApproved) || isQuestionLocked(question._id) || shouldShowAllQuestions}
                    className={isSubmitted && showAnswers && displayAttempt?.answers.find(a => a.question === question._id && a.answer === true)?.isCorrect ? "text-success" : ""}
                  />
                  <Form.Check
                    type="radio"
                    name={`question-${question._id}`}
                    id={`question-${question._id}-false`}
                    label="False"
                    checked={answers[question._id] === false}
                    onChange={() => handleAnswerChange(question._id, false)}
                    disabled={isSubmitted || (quiz.webcamRequired && !webcamApproved) || isQuestionLocked(question._id) || shouldShowAllQuestions}
                    className={isSubmitted && showAnswers && displayAttempt?.answers.find(a => a.question === question._id && a.answer === false)?.isCorrect ? "text-success" : ""}
                  />
                  {isSubmitted && displayAttempt && showAnswers && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Correct answer: {question.correctAnswer ? "True" : "False"}
                      </small>
                    </div>
                  )}
                </div>
              )}

              {question.questionType === "Fill in the Blank" && (
                <div>
                  <Form.Control
                    type="text"
                    value={answers[question._id] as string || ""}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    disabled={isSubmitted || (quiz.webcamRequired && !webcamApproved) || isQuestionLocked(question._id) || shouldShowAllQuestions}
                    className={isSubmitted && showAnswers && displayAttempt?.answers.find(a => a.question === question._id)?.isCorrect ? "border-success" : isSubmitted && showAnswers ? "border-danger" : ""}
                  />
                  {isSubmitted && displayAttempt && showAnswers && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Possible correct answers: {question.possibleAnswers?.join(", ")}
                      </small>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}

      {isSubmitted && attempt && (
        <Alert variant={attempt.score === attempt.totalPoints ? "success" : "warning"} className="mb-3">
          <h5>Quiz Results</h5>
          <p>
            <strong>Score:</strong> {attempt.score} / {attempt.totalPoints} points
          </p>
          <p>
            <strong>Percentage:</strong> {attempt.totalPoints > 0 ? Math.round((attempt.score / attempt.totalPoints) * 100) : 0}%
          </p>
        </Alert>
      )}

      {!isSubmitted && !shouldShowAllQuestions && (
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button 
            variant="danger" 
            size="lg" 
            onClick={handleSubmit}
            disabled={quiz.webcamRequired && !webcamApproved}
          >
            Submit Quiz
          </Button>
        </div>
      )}
    </div>
  );
}


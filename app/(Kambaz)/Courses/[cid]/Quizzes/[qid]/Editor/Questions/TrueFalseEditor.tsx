"use client";

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Question } from "./client";

interface TrueFalseEditorProps {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export default function TrueFalseEditor({ question, onSave, onCancel }: TrueFalseEditorProps) {
  const [title, setTitle] = useState(question.title || "");
  const [points, setPoints] = useState(question.points || 0);
  const [questionText, setQuestionText] = useState(question.question || "");
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer ?? true);

  const handleSave = () => {
    const updatedQuestion: Question = {
      ...question,
      title,
      points,
      question: questionText,
      questionType: "True/False",
      correctAnswer,
    };
    onSave(updatedQuestion);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Question Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "200px" }}
          />
        </div>
        <div className="d-flex align-items-center gap-2">
          <Form.Label className="mb-0">pts:</Form.Label>
          <Form.Control
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            style={{ width: "80px" }}
          />
        </div>
      </div>

      <p className="text-muted mb-3">
        Enter your question text, then select if True or False is the correct answer.
      </p>

      <Form.Group className="mb-3">
        <Form.Label><strong>Question:</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question text here..."
        />
        <Form.Text className="text-muted">
          You can use HTML formatting in the question text.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>Answers:</strong></Form.Label>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center gap-2">
            <Form.Check
              type="radio"
              name="correctAnswer"
              id="true-answer"
              checked={correctAnswer === true}
              onChange={() => setCorrectAnswer(true)}
            />
            <Form.Label htmlFor="true-answer" className="mb-0">
              True {correctAnswer === true && <span className="text-success">✓</span>}
            </Form.Label>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form.Check
              type="radio"
              name="correctAnswer"
              id="false-answer"
              checked={correctAnswer === false}
              onChange={() => setCorrectAnswer(false)}
            />
            <Form.Label htmlFor="false-answer" className="mb-0">
              False {correctAnswer === false && <span className="text-success">✓</span>}
            </Form.Label>
          </div>
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          {question._id === "new" ? "Save Question" : "Update Question"}
        </Button>
      </div>
    </div>
  );
}


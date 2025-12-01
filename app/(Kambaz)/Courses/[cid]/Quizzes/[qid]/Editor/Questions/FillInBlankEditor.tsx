"use client";

import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaTrash, FaCheck } from "react-icons/fa";
import { Question } from "./client";

interface FillInBlankEditorProps {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export default function FillInBlankEditor({ question, onSave, onCancel }: FillInBlankEditorProps) {
  const [title, setTitle] = useState(question.title || "");
  const [points, setPoints] = useState(question.points || 0);
  const [questionText, setQuestionText] = useState(question.question || "");
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>(question.possibleAnswers || [""]);
  const [caseSensitive, setCaseSensitive] = useState(question.caseSensitive ?? false);

  useEffect(() => {
    if (question.possibleAnswers && question.possibleAnswers.length > 0) {
      setPossibleAnswers(question.possibleAnswers);
    } else {
      setPossibleAnswers([""]);
    }
  }, [question]);

  const handleAddAnswer = () => {
    setPossibleAnswers([...possibleAnswers, ""]);
  };

  const handleRemoveAnswer = (index: number) => {
    if (possibleAnswers.length > 1) {
      setPossibleAnswers(possibleAnswers.filter((_, i) => i !== index));
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...possibleAnswers];
    newAnswers[index] = value;
    setPossibleAnswers(newAnswers);
  };

  const handleSave = () => {
    const updatedQuestion: Question = {
      ...question,
      title,
      points,
      question: questionText,
      questionType: "Fill in the Blank",
      possibleAnswers: possibleAnswers.filter(a => a.trim() !== ""),
      caseSensitive,
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
        Enter your question text, then define all possible correct answers for the blank. Students will see the question followed by a small text box to type their answer.
      </p>

      <Form.Group className="mb-3">
        <Form.Label><strong>Question:</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question text here. Use _______ to indicate the blank."
        />
        <Form.Text className="text-muted">
          You can use HTML formatting in the question text. Use underscores (_______) to indicate where the blank should be.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>Answers:</strong></Form.Label>
        {possibleAnswers.map((answer, index) => (
          <div key={index} className="d-flex align-items-center gap-2 mb-2">
            <Form.Label className="mb-0 me-2">Possible Answer:</Form.Label>
            <Form.Control
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Enter a possible correct answer"
            />
            {possibleAnswers.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleRemoveAnswer(index)}
              >
                <FaTrash />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="link"
          className="text-danger p-0 mt-2"
          onClick={handleAddAnswer}
        >
          <FaCheck className="me-1" /> + Add Another Answer
        </Button>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="case-sensitive"
          label="Case Sensitive"
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
        />
        <Form.Text className="text-muted">
          If unchecked, answers will be compared case-insensitively (default).
        </Form.Text>
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


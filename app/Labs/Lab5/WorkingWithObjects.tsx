"use client";

import React, { useState } from "react";
import { FormControl, FormCheck } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });

  const [module, setModule] = useState({
    id: "M101",
    name: "Introduction to React",
    description: "Learn the fundamentals of React",
    course: "CS4550",
  });

  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      
      {/* Assignment Section */}
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary me-2"
         href={`${ASSIGNMENT_API_URL}`}>
        Get Assignment
      </a>
      <a id="wd-retrieve-module" className="btn btn-primary"
         href={`${MODULE_API_URL}`}>
        Get Module
      </a>
      <hr/>
      
      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary me-2"
         href={`${ASSIGNMENT_API_URL}/title`}>
        Get Title
      </a>
      <a id="wd-retrieve-module-name" className="btn btn-primary"
         href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a>
      <hr/>
      
      <h4>Modifying Assignment Properties</h4>
      <div className="mb-3">
        <label className="form-label">Title:</label>
        <div className="d-flex align-items-center gap-2">
          <FormControl className="w-75" id="wd-assignment-title"
            defaultValue={assignment.title} onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })}/>
          <a id="wd-update-assignment-title"
             className="btn btn-primary"
             href={`${ASSIGNMENT_API_URL}/title/${encodeURIComponent(assignment.title)}`}>
            Update Title
          </a>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Score:</label>
        <div className="d-flex align-items-center gap-2">
          <FormControl type="number" className="w-75" id="wd-assignment-score"
            defaultValue={assignment.score} onChange={(e) =>
              setAssignment({ ...assignment, score: parseInt(e.target.value) || 0 })}/>
          <a id="wd-update-assignment-score"
             className="btn btn-primary"
             href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
            Update Score
          </a>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Completed:</label>
        <div className="d-flex align-items-center gap-2">
          <FormCheck type="checkbox" id="wd-assignment-completed"
            checked={assignment.completed} onChange={(e) =>
              setAssignment({ ...assignment, completed: e.target.checked })}/>
          <a id="wd-update-assignment-completed"
             className="btn btn-primary"
             href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
            Update Completed
          </a>
        </div>
      </div>
      <hr />
      
      {/* Module Section */}
      <h4>Modifying Module Properties</h4>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <div className="d-flex align-items-center gap-2">
          <FormControl className="w-75" id="wd-module-name"
            defaultValue={module.name} onChange={(e) =>
              setModule({ ...module, name: e.target.value })}/>
          <a id="wd-update-module-name"
             className="btn btn-primary"
             href={`${MODULE_API_URL}/name/${encodeURIComponent(module.name)}`}>
            Update Name
          </a>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Description:</label>
        <div className="d-flex align-items-center gap-2">
          <FormControl className="w-75" id="wd-module-description"
            defaultValue={module.description} onChange={(e) =>
              setModule({ ...module, description: e.target.value })}/>
          <a id="wd-update-module-description"
             className="btn btn-primary"
             href={`${MODULE_API_URL}/description/${encodeURIComponent(module.description)}`}>
            Update Description
          </a>
        </div>
      </div>
      <hr />
    </div>
  );
}


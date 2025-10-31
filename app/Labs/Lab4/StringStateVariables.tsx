"use client";

import { useState } from "react";
export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div>
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <input
        defaultValue={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="form-control"
        placeholder="Enter first name"
      />
<hr/></div>);}

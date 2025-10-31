"use client";

import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(7);
  console.log(count);
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button 
        onClick={() => setCount(count + 1)}
        id="wd-counter-up-click"
        style={{
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          margin: '5px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Up
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        id="wd-counter-down-click"
        style={{
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          margin: '5px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Down
      </button>
      <hr/>
    </div>
);}

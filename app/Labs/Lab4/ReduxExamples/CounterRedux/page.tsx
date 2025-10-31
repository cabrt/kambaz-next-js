"use client";

import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./counterReducer";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

interface RootState {
  counterReducer: {
    count: number;
  };
}

export default function CounterRedux() {
  const { count } = useSelector((state: RootState) => state.counterReducer);
  const dispatch = useDispatch();
  return (
    <div id="wd-counter-redux">
      <h2>Counter Redux</h2>
      <h3>{count}</h3>
      <button onClick={() => dispatch(increment())}
              id="wd-counter-redux-increment-click"> Increment </button>
      <button onClick={() => dispatch(decrement())}
              id="wd-counter-redux-decrement-click"> Decrement </button>
      <hr/>
    </div>
);}

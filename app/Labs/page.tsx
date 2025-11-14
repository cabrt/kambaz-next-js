"use client";

import store from "./store";
import { Provider } from "react-redux";
import TOC from "./TOC";

export default function Labs() {
  return (
    <Provider store={store}>
      <div className="container-fluid">
      <h1>Labs</h1>
      <h2>Conor Abramson-Tieu</h2>
        <TOC />
    </div>
    </Provider>
  );
}

"use client";

import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import { Provider } from "react-redux";
import store from "./store";
import Session from "./Account/Session";
import "./styles.css";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div id="wd-kambaz">
          <div className="d-flex">
            <div>
              <KambazNavigation />
            </div>
            <div className="wd-main-content-offset p-3 flex-fill">
              {children}
            </div>
          </div>
        </div>
      </Session>
    </Provider>
  );
}

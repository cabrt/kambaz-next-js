"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
    } catch (err: unknown) {
      // 401 is expected when no user is logged in, handle silently
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status !== 401) {
          console.error(err);
        }
      } else {
        console.error(err);
      }
      // Set currentUser to null if profile fetch fails
      dispatch(setCurrentUser(null));
    }
    setPending(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pending) {
    return <>{children}</>;
  }

  return null;
}


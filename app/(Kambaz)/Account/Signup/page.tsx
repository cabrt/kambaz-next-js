"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    try {
      setError(null);
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/Account/Profile");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Signup failed");
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <div id="wd-signup-screen" className="p-3">
      <h3>Sign up</h3>
      {error && (
        <div className="alert alert-danger mb-2">{error}</div>
      )}
      <Form.Control
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={user.username || ""}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <Form.Control
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
        value={user.password || ""}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Button
        id="wd-signup-btn"
        className="w-100 mb-2"
        onClick={signup}
      >
        Sign up
      </Button>
      <Link id="wd-signin-link" href="/Account/Signin">Sign in</Link>
    </div>
  );
}

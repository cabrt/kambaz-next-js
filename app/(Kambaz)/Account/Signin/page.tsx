"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import * as client from "../client";

interface Credentials {
  username: string;
  password: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState<Credentials>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const signin = async () => {
    try {
      setError(null);
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/Dashboard");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || "Unable to login. Try again later.");
      } else {
        setError("Unable to login. Try again later.");
      }
    }
  };
  
  return (
    <div id="wd-signin-screen" className="p-3">
      <h3>Sign in</h3>
      {error && (
        <div className="alert alert-danger mb-2">{error}</div>
      )}
      <Form.Control 
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={credentials.username || ""}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <Form.Control 
        id="wd-password"
        placeholder="password" 
        type="password"
        className="mb-2"
        value={credentials.password || ""}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <Button 
        id="wd-signin-btn"
        className="w-100 mb-2"
        onClick={signin}
      >
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import * as client from "../../client";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
  role: string;
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
}

export default function PeopleDetails() {
  const params = useParams();
  const uid = params?.uid as string | undefined;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      const fetchedUser = await client.findUserById(uid);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetchUser();
    }
  }, [uid, fetchUser]);

  if (!uid || loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={() => router.back()}
        className="btn position-fixed end-0 top-0 wd-close-details"
        style={{ zIndex: 1000 }}
      >
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4 wd-name">
        {user.firstName} {user.lastName}
      </div>
      <b>Roles:</b> <span className="wd-roles">{user.role}</span>
      <br />
      <b>Login ID:</b> <span className="wd-login-id">{user.loginId || "N/A"}</span>
      <br />
      <b>Section:</b> <span className="wd-section">{user.section || "N/A"}</span>
      <br />
      <b>Total Activity:</b> <span className="wd-total-activity">{user.totalActivity || "N/A"}</span>
    </div>
  );
}


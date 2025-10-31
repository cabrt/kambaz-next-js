"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";

interface RootState {
  accountReducer: {
    currentUser: {
      _id: string;
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      email: string;
      dob: string;
      role: string;
    } | null;
  };
}

interface Profile {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const fetchProfile = useCallback(() => {
    if (!currentUser) return router.push("/Account/Signin");
    setProfile(currentUser);
  }, [currentUser, router]);
  
  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };
  
  useEffect(() => { 
    fetchProfile(); 
  }, [fetchProfile]);
  
  return (
    <div className="wd-profile-screen p-3">
      <h3>Profile</h3>
      {profile && (
        <div>
          <Form.Control 
            defaultValue={profile.username} 
            id="wd-username" 
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          <Form.Control 
            defaultValue={profile.password} 
            id="wd-password" 
            className="mb-2"
            type="password"
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />
          <Form.Control 
            defaultValue={profile.firstName} 
            id="wd-firstname" 
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
          <Form.Control 
            defaultValue={profile.lastName} 
            id="wd-lastname" 
            className="mb-2"
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
          <Form.Control 
            defaultValue={profile.dob} 
            id="wd-dob" 
            className="mb-2"
            type="date"
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <Form.Control 
            defaultValue={profile.email} 
            id="wd-email" 
            className="mb-2"
            type="email"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Form.Select 
            value={profile.role || "USER"}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            className="form-control mb-2" 
            id="wd-role"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </Form.Select>
          <Button 
            onClick={signout} 
            className="w-100 mb-2" 
            id="wd-signout-btn"
            variant="danger"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}

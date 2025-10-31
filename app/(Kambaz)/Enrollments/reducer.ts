import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

const initialState = {
  enrollments: enrollments as Enrollment[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollUserInCourse: (state, { payload: { userId, courseId } }) => {
      // Check if already enrolled
      const isEnrolled = state.enrollments.some(
        (e) => e.user === userId && e.course === courseId
      );
      if (!isEnrolled) {
        const newEnrollment: Enrollment = {
          _id: `${userId}-${courseId}-${Date.now()}`,
          user: userId,
          course: courseId,
        };
        state.enrollments = [...state.enrollments, newEnrollment];
      }
    },
    unenrollUserFromCourse: (state, { payload: { userId, courseId } }) => {
      state.enrollments = state.enrollments.filter(
        (e) => !(e.user === userId && e.course === courseId)
      );
    },
    setEnrollments: (state, { payload: enrollments }) => {
      state.enrollments = enrollments;
    },
  },
});

export const { enrollUserInCourse, unenrollUserFromCourse, setEnrollments } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;


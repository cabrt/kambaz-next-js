import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department?: string;
  credits?: number;
  description: string;
  image?: string;
}

const initialState = {
  courses: [] as Course[],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state, { payload: course }) => {
      const newCourse: Course = {
        _id: uuidv4(),
        name: course.name,
        number: course.number,
        startDate: course.startDate,
        endDate: course.endDate,
        department: course.department,
        credits: course.credits,
        description: course.description,
        image: course.image || "/images/reactjs.jpg",
      };
      state.courses = [...state.courses, newCourse];
    },
    deleteCourse: (state, { payload: courseId }) => {
      state.courses = state.courses.filter(
        (c: Course) => c._id !== courseId
      );
    },
    updateCourse: (state, { payload: course }) => {
      state.courses = state.courses.map((c: Course) =>
        c._id === course._id ? course : c
      );
    },
    setCourses: (state, { payload: courses }) => {
      state.courses = courses;
    },
  },
});

export const { addCourse, deleteCourse, updateCourse, setCourses } =
  coursesSlice.actions;
export default coursesSlice.reducer;


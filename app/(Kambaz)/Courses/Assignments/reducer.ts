import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../Database";
import { v4 as uuidv4 } from "uuid";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableDate: string;
  availableUntil?: string;
  editing?: boolean;
}

interface AssignmentInput {
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableDate: string;
  availableUntil?: string;
}

const initialState = {
  assignments: assignments as Assignment[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload: assignment }: { payload: AssignmentInput }) => {
      const newAssignment: Assignment = {
        _id: uuidv4(),
        title: assignment.title,
        course: assignment.course,
        description: assignment.description,
        points: assignment.points,
        dueDate: assignment.dueDate,
        availableDate: assignment.availableDate,
        availableUntil: assignment.availableUntil,
      };
      state.assignments = [...state.assignments, newAssignment];
    },
    deleteAssignment: (state, { payload: assignmentId }: { payload: string }) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== assignmentId);
    },
    updateAssignment: (state, { payload: assignment }: { payload: Assignment }) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignment._id ? assignment : a
      );
    },
    editAssignment: (state, { payload: assignmentId }: { payload: string }) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignmentId ? { ...a, editing: true } : a
      );
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment, editAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

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

const initialState = {
  assignments: [] as Assignment[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, { payload: assignment }: { payload: Assignment }) => {
      state.assignments = [...state.assignments, assignment];
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

export const { setAssignments, addAssignment, deleteAssignment, updateAssignment, editAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;

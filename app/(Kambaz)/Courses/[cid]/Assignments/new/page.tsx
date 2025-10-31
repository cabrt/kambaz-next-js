import { redirect } from "next/navigation";

export default function NewAssignmentPage({ params }: { params: { cid: string } }) {
  redirect(`/Courses/${params.cid}/Assignments/new/Editor`);
}

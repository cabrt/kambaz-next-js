import { redirect } from "next/navigation";

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ cid: string; aid: string }>;
}) {
  const { cid, aid } = await params;
  redirect(`/Courses/${cid}/Assignments/${aid}/Editor`);
}

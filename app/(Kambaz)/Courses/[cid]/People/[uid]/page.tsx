"use client";

import PeopleTable from "../page";

export default function PeoplePageWithDetails() {
  // This page renders the same PeopleTable component
  // PeopleDetails will check for uid from useParams and show details
  return <PeopleTable />;
}


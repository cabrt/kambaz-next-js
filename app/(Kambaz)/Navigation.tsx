"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
  const pathname = usePathname();
  
  const links = [
    { href: "/Account", label: "Account", icon: FaRegCircleUser, id: "wd-account-link", matchPath: "/Account" },
    { href: "/Dashboard", label: "Dashboard", icon: AiOutlineDashboard, id: "wd-dashboard-link", matchPath: "/Dashboard" },
    { href: "/Dashboard", label: "Courses", icon: LiaBookSolid, id: "wd-course-link", matchPath: "/Courses" },
    { href: "/Calendar", label: "Calendar", icon: IoCalendarOutline, id: "wd-calendar-link", matchPath: "/Calendar" },
    { href: "/Inbox", label: "Inbox", icon: FaInbox, id: "wd-inbox-link", matchPath: "/Inbox" },
    { href: "/Labs", label: "Labs", icon: LiaCogSolid, id: "wd-labs-link", matchPath: "/Labs" },
  ];

  return (
    <ListGroup id="wd-kambaz-navigation" style={{ width: 110 }}
         className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      <ListGroupItem className="bg-black border-0 text-center" as="a"
               target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem><br />
      
      {links.map((link) => {
        const isActive = pathname.startsWith(link.matchPath);
        const Icon = link.icon;
        const isAccount = link.label === "Account";
        
        return (
          <div key={link.id}>
            <ListGroupItem className={`border-0 text-center ${isActive ? "bg-white" : "bg-black"}`}>
              <Link href={link.href} id={link.id} className={`text-decoration-none ${isActive ? "text-danger" : "text-white"}`}>
                <Icon className={`fs-1 ${isAccount ? (isActive ? "text-danger" : "text-white") : "text-danger"}`} />
                <br />
                {link.label}
              </Link>
            </ListGroupItem><br />
          </div>
        );
      })}
    </ListGroup>
  );
}

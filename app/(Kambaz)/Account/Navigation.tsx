"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

interface RootState {
  accountReducer: {
    currentUser: {
      _id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    } | null;
  };
}

export default function AccountNavigation() {
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

  const active = (path: string) => (pathname.includes(path) ? "active" : "text-danger");

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const href = `/Account/${link}`;
        return (
          <Link
            key={href}
            href={href}
            className={`list-group-item border-0 ${active(href)}`}
          >
            {link}
          </Link>
        );
      })}
      {currentUser && currentUser.role === "ADMIN" && (
        <Link
          href="/Account/Users"
          className={`list-group-item border-0 ${active("Users")}`}
        >
          Users
        </Link>
      )}
    </div>
  );
}

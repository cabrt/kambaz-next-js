"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Signin", href: "/Account/Signin" },
    { label: "Signup", href: "/Account/Signup" },
    { label: "Profile", href: "/Account/Profile" },
  ];

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`list-group-item border-0 ${
            pathname.includes(link.href) ? "active" : "text-danger"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

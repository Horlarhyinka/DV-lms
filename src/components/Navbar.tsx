"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm transition-colors pb-0.5 ${
        isActive(href)
          ? "text-indigo-600 font-medium border-b-2 border-indigo-600"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );

  const initials = session?.user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <Link href="/dashboard" className="text-xl font-bold text-indigo-600 tracking-tight">
        DV-LMS
      </Link>

      <div className="flex items-center gap-5 text-sm">
        {session ? (
          <>
            {navLink("/dashboard", "Dashboard")}
            {navLink("/courses", "Courses")}
            {role === "student" && navLink("/grades", "Grades")}
            {role === "instructor" && (
              <Link href="/courses/new">
                <Button variant="primary" size="sm">+ New Course</Button>
              </Link>
            )}

            <span className="w-px h-4 bg-gray-200 mx-1" aria-hidden="true" />

            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center select-none">
                {initials}
              </span>
              <span className="text-gray-700 text-sm">{session.user?.name}</span>
              {role && <Badge variant="info">{role}</Badge>}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              aria-label="Sign out"
              className="text-gray-500 hover:text-red-600 transition-colors text-sm flex items-center gap-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-500 hover:text-gray-900 transition-colors">Login</Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

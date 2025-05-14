"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, getSession } from "next-auth/react";

export default function Header() {
  const [session, setSession] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      setSession(sessionData);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } bg-gray-950 text-white px-6 md:px-24 py-3`}
    >
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full md:w-auto mb-2 md:mb-0">
          <h1 className="text-xl font-bold">
            <Link href="/" className="hover:no-underline">
              Novelit
            </Link>
          </h1>
        </div>
        <ul className="w-full md:w-auto flex flex-wrap justify-end gap-2">
          {!session ? (
            <>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/auth/login">Login</Link>
              </li>
              <li>
                <Link href="/auth/signup">Sign up</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/novels/create">Upload</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="text-blue-500 hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

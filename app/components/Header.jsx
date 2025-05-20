"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, getSession } from "next-auth/react";

const NAV_HEIGHT = 64;

export default function Header() {
  const [session, setSession] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const userId = session?.user?.id;

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

  useEffect(() => {
    const content = document.getElementById("page-content");
    if (content) {
      content.style.paddingTop = visible ? `${NAV_HEIGHT}px` : "0";
    }
  }, [visible]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } bg-gray-950 text-white px-6 md:px-24 py-3`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <h1 className="text-xl font-bold">
          <Link href="/" className="hover:no-underline">
            Novelit
          </Link>
        </h1>
        <ul className="flex flex-wrap justify-end gap-3">
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
                <Link href={`/profile/${userId}`}>Profile</Link>
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

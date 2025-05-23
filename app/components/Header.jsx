"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, getSession } from "next-auth/react";
import SearchBar from "./SearchBar";

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
      } bg-gray-950 text-white px-4 md:px-24 py-3`}
    >
      <div className="flex flex-wrap md:flex-nowrap items-center w-full">
        {/* Bloque 1: Logo */}
        <div className="w-full md:w-1/2 mb-2 md:mb-0">
          <h1 className="text-xl font-bold">
            <Link href="/" className="hover:no-underline">
              Novelit
            </Link>
          </h1>
        </div>

        {/* Bloque 2: Links + SearchBar */}
        <div className="w-full flex flex-row items-center gap-2 md:gap-4 min-w-0">
          {/* Links */}
          <ul className="flex flex-row flex-grow justify-end flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 overflow-hidden">
            {!session ? (
              <>
                <li className="pr-2 pb-2 md:pr-4 md:pb-0">
                  <Link href="/">Home</Link>
                </li>
                <li className="pr-2 pb-2 md:pr-4 md:pb-0">
                  <Link href="/auth/login">Login</Link>
                </li>
                <li className="pr-2 pb-2 md:pr-4 md:pb-0">
                  <Link href="/auth/signup">Sign up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="pr-2 pb-2 md:pr-4 md:pb-0">
                  <Link href="/">Home</Link>
                </li>
                <li className="pr-2 pb-2 md:pr-4 md:pb-0">
                  <Link href="/novels/create">Upload</Link>
                </li>
                <li className="pr-2 pb-2 md:pr-4 md:pb-0">
                  <Link href={`/profile/${userId}`}>Profile</Link>
                </li>
                <li className="pr-2 pb-2 md:pr-4 md:pb-0">
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

          <div className="w-auto shrink-0">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}

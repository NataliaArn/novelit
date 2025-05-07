"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, getSession } from "next-auth/react";

export default function Header() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      setSession(sessionData);
    }
    fetchSession();
  }, []);

  return (
    <nav className="flex flex-wrap items-center justify-between bg-gray-950 text-white px-6 md:px-24 py-3">
      <div className="w-full md:w-auto mb-2 md:mb-0">
        <h1 className="text-xl font-bold">Novelit</h1>
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
    </nav>
  );
}

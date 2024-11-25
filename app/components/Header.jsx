import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import { signOut } from "next-auth/react";

async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex justify-between items-center bg-gray-950 text-white px-24 py-3">
      <h1 className="text-xl font-bold">NextAuth</h1>
      <ul className="flex gap-x-2">
        {!session?.user ? (
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
              <Link href="/">Upload</Link>
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
export default Header;

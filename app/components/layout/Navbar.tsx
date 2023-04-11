"use client";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import UpgradeBanner from "../UpgradeBanner";

export default function Navbar({ session }) {
  return (
    <>
      <nav className="bg-teal-800 p-4 flex justify-between items-center">
        <ul className="flex justify-center">
          <li className="mr-4">
            <Link href="/">Home</Link>
          </li>
          {session?.user?.role === "ADMIN" && (
            <li className="mr-4">
              <Link href="/categories">Categories</Link>
            </li>
          )}
          {session && (
            <li className="mr-4">
              <Link href="/profile">My profile</Link>
            </li>
          )}
        </ul>
        <div>
          {!session ? (
            <div>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
              <button className="w-28 ml-3" onClick={() => signIn()}>
                Sign in
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <p>Hello, {session.user.name}!</p>
              <button className="ml-3 w-28" onClick={() => signOut()}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
      {!session || (session?.user?.riderType !== "PRO" && <UpgradeBanner />)}
    </>
  );
}

"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className=" bg-teal-800 p-4">
      <ul className="flex justify-center">
        <li className="mx-4">
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/categories">Categories</Link>
        </li>
      </ul>
    </nav>
  );
}

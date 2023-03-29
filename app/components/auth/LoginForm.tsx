"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type userDataType = {
  email: string;
  password: string;
};

export default function RegisterForm() {
  const [userData, setUserData] = useState<userDataType>({
    email: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsDisabled(true);
      const res = await signIn("credentials", {
        redirect: false,
        ...userData,
        callbackUrl,
      });
      if (!res?.error) {
        window.location.replace(callbackUrl);
      } else {
        setError("Invalid email or password");
        setIsDisabled(false);
      }
    } catch (error: any) {}
  };
  return (
    <div className="w-full md:w-1/2 bg-slate-500 p-10 my-16 rounded-lg hover:shadow-2xl transition-shadow duration-300">
      <h1 className="text-xl text-center font-bold m-5">Welcome back!</h1>
      <form onSubmit={handleLogin}>
        <input
          className="mb-3"
          type="text"
          value={userData.email}
          placeholder="email"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <input
          className="mb-3"
          type="password"
          value={userData.password}
          placeholder="password"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        {error && (
          <p className="text-xs bg-red-500 p-1 mb-3 rounded-md">{error}</p>
        )}
        <button type="submit" disabled={isDisabled}>
          Login
        </button>
        <p className="mt-5 text-sm text-right">
          New here? Go{" "}
          <Link
            href="/register"
            className="bg-slate-600 py-1 px-2 rounded-lg hover:bg-slate-300 hover:text-black transition-all duration-300"
          >
            register
          </Link>{" "}
          now! 💪🏻
        </p>
      </form>
    </div>
  );
}

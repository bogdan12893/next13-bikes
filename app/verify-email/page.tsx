"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmail() {
  const search = useSearchParams();
  let token = search.get("token");
  let toastId: string = "pageToastId";

  const mutation = useMutation({
    mutationFn: () => {
      return axios.get(`/api/auth/email-verification?token=${token}`);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: toastId });
    },
    onSuccess: (data) => {
      toast.success(data?.data, { id: toastId });
    },
  });

  useEffect(() => {
    mutation.mutate();
  }, []);
  return (
    <div className="flex justify-center">
      <div className="bg-teal-700 p-5 my-10 mx-5 rounded-lg w-full md:w-1/2 lg:w-1/3">
        <div>{mutation.isLoading && <p>loading...</p>}</div>
        <div>
          {mutation.error && (
            <p className="text-red-200">{mutation.error?.response?.data} ⛔️</p>
          )}
        </div>
        <div>{mutation.data && <p>{mutation.data?.data} ✅</p>}</div>
        <Link href="/login" className="block mt-5">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}

"use client";
import axios from "axios";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function VerifyEmail() {
  const [newPass, setNewPass] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const search = useSearchParams();
  let token = search.get("token");
  const toastId = "toastId";

  const mutation = useMutation({
    mutationFn: () => {
      return axios.patch(`/api/auth/reset-password?token=${token}`, {
        password: newPass,
      });
    },
    onError: (error: Error | any) => {
      setNewPass("");
      toast.error(error?.response?.data, { id: toastId });
      setIsDisabled(false);
    },
    onSuccess: () => {
      setNewPass("");
      toast.success("You can login with your new password.", { id: toastId });
      setIsDisabled(false);
      setSubmitted(true);
    },
  });

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Reseting password, please be patient 🙃", { id: toastId });
    mutation.mutate();
  };

  return (
    <div className="flex justify-center">
      <div className="bg-gray-800 w-full p-10 mb-10 rounded-b-xl lg:w-1/2 lg:px-20">
        {submitted ? (
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl mb-4 text-center">
              Password Updated!
            </h1>
            <Link href="/login" className="hover:underline">
              Login now!
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-bold text-2xl mb-4 text-center">
              Reset Password
            </h1>
            <form onSubmit={submitForm}>
              <input
                className="mb-3"
                type="password"
                value={newPass}
                placeholder="New Password"
                onChange={(e) => setNewPass(e.target.value)}
              />
              <button disabled={isDisabled} className="mt-5">
                submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

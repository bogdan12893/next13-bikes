"use client";
import axios from "axios";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);
  const toastId = "toastId";

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(`/api/auth/forgot-password`, { email: email });
    },
    onError: (error: Error | any) => {
      setEmail("");
      toast.error(error?.response?.data, { id: toastId });
      setIsDisabled(false);
    },
    onSuccess: () => {
      setEmail("");
      toast.success("You can check your email", { id: toastId });
      setIsDisabled(false);
    },
  });

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Submitting, please be patient 🙃", { id: toastId });
    mutation.mutate();
  };

  return (
    <div className="flex justify-center">
      <div className="bg-gray-800 w-full p-10 mb-10 rounded-b-xl lg:w-1/2 lg:px-20">
        <h1 className="font-bold text-2xl mb-4 text-center">Forgot Password</h1>
        <form onSubmit={submitForm}>
          <input
            className="mb-3"
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button disabled={isDisabled} className="mt-5">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type userDataType = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [userData, setUserData] = useState<userDataType>({
    name: "",
    email: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  let registerToastId: string = "bikeToast";

  const mutation = useMutation({
    mutationFn: (data: userDataType) => {
      return axios.post(`/api/auth/register`, data);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: registerToastId });
      setIsDisabled(false);
    },
    onSuccess: () => {
      toast.success("Account created successfully", { id: registerToastId });
      router.push("/");
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Creating your account 🤖", { id: registerToastId });
    mutation.mutate(userData);
  };
  return (
    <div className="w-full md:w-1/2 bg-slate-500 p-10 my-16 rounded-lg hover:shadow-2xl transition-shadow duration-300">
      <h1 className="text-xl text-center font-bold m-5">Register</h1>
      <form onSubmit={handleRegister}>
        <input
          className="mb-3"
          type="text"
          value={userData.name}
          placeholder="name"
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
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
        <button type="submit" disabled={isDisabled}>
          Submit
        </button>
      </form>
    </div>
  );
}

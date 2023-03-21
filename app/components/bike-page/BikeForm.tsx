"use client";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BikeType } from "@/app/types/Bike";

export default function BikeForm() {
  const [bike, setBike] = useState<BikeType>({ brand: "", type: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const queryCLient = useQueryClient();
  let bikeToastId: string = "bikeToast";

  const mutation = useMutation({
    mutationFn: (data: BikeType) => {
      return axios.post(`/api/bikes`, data);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: bikeToastId });
      setBike({ brand: "", type: "" });
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Bike created successfully", { id: bikeToastId });
      queryCLient.invalidateQueries(["bikes"]);
      setBike({ brand: "", type: "" });
      setIsDisabled(false);
    },
  });

  const submitBike = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Creating your bike", { id: bikeToastId });
    mutation.mutate(bike);
  };

  return (
    <div className="bg-gray-800 w-full p-10 mb-10 rounded-b-xl lg:w-1/2 lg:px-20">
      <h1 className="font-bold text-2xl mb-4 text-center">◀︎ Bike Garage ▶︎</h1>
      <form onSubmit={submitBike}>
        <input
          className="mb-3"
          type="text"
          value={bike.brand}
          placeholder="brand"
          onChange={(e) => setBike({ ...bike, brand: e.target.value })}
        />
        <input
          className="mb-3"
          type="text"
          value={bike.type}
          placeholder="type"
          onChange={(e) => setBike({ ...bike, type: e.target.value })}
        />
        <button disabled={isDisabled}>Add bike</button>
      </form>
    </div>
  );
}

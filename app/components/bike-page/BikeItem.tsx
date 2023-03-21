"use client";
import { BikeType } from "@/app/types/Bike";
import Link from "next/link";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function BikeItem({ id, brand, type, createdAt }: BikeType) {
  const [isDisabled, setIsDisabled] = useState(false);
  const queryCLient = useQueryClient();
  let bikeToastId: string = "bikeToast";

  const createdDate = () => {
    const date = new Date(createdAt);
    return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
  };

  const mutation = useMutation({
    mutationFn: (id: string) => {
      setIsDisabled(true);
      toast.loading("Deleting bike...", { id: bikeToastId });
      return axios.delete(`/api/bikes/${id}`);
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: bikeToastId });
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      toast.success("Bike created successfully", { id: bikeToastId });
      queryCLient.invalidateQueries(["bikes"]);
      setIsDisabled(false);
    },
  });

  return (
    <div className="block w-full lg:w-1/2">
      <div className="bg-gray-700 p-5 mb-3 rounded-lg">
        <div className="flex justify-end">
          <button
            className="danger"
            disabled={isDisabled}
            onClick={() => mutation.mutate(id)}
          >
            ✕
          </button>
        </div>
        <div>
          <h3>
            <Link
              href={{ pathname: `/bike/${id}` }}
              className="hover:underline"
            >
              Brand: {brand}
            </Link>
          </h3>
          <h4>Type: {type}</h4>
        </div>
        <div>
          <p className="text-xs text-right">{createdDate()}</p>
        </div>
      </div>
    </div>
  );
}

"use client";
import { BikeType } from "@/app/types/Bike";
import Link from "next/link";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function BikeItem({
  id,
  brand,
  description,
  model,
  createdAt,
  categories,
}: BikeType) {
  const [isDisabled, setIsDisabled] = useState(false);
  const queryCLient = useQueryClient();
  let bikeToastId: string = "bikeToast";

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
              href={{ pathname: `/bikes/${id}` }}
              className="hover:underline"
            >
              Brand: {brand}
            </Link>
          </h3>
          <h4 className="my-4 text-md">{model}</h4>
          <p className="my-4 text-sm">{description}</p>
          <h4>Bike Categories:</h4>
          {categories.length > 0
            ? categories.map((cat) => {
                return <span key={cat.id}>{cat.name} | </span>;
              })
            : "Missing category"}
        </div>
        <div>
          <p className="text-xs text-right">{createdAt}</p>
        </div>
      </div>
    </div>
  );
}

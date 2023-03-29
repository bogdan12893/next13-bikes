"use client";
import { BikeType } from "@/app/types/Bike";
import Link from "next/link";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import moment from "moment";

export default function BikeItem({
  id,
  brand,
  description,
  model,
  createdAt,
  categories,
  user,
  comments,
}: BikeType) {
  const { data: session } = useSession();

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
      queryCLient.invalidateQueries(["userBikes"]);
      setIsDisabled(false);
    },
  });

  return (
    <div className="block w-full lg:w-1/2">
      <div className="bg-gray-700 p-5 mb-3 rounded-lg">
        <div className="flex justify-end">
          {session?.user.id === user?.id && (
            <button
              className="danger"
              disabled={isDisabled}
              onClick={() => mutation.mutate(id)}
            >
              ✕
            </button>
          )}
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
        <p className="mt-5 text-xs">Comments: {comments}</p>
        <div className="flex justify-between mt-2">
          {user && (
            <p className="text-xs">
              Created by: <strong>{user?.name}</strong>
            </p>
          )}
          <p className="text-xs text-right">{moment(createdAt).fromNow()}</p>
        </div>
      </div>
    </div>
  );
}

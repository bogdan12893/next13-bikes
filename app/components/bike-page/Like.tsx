"use client";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function Like({ id, count, likes }) {
  const { data: session } = useSession();
  const queryCLient = useQueryClient();
  let bikeToastId: string = "bikeToast";

  const userIds = likes?.map((like) => like.userId);
  const setLikeState = userIds.includes(session?.user.id);

  const [liked, setLiked] = useState(setLikeState);

  const mutationLike = useMutation({
    mutationFn: () => {
      return axios.post(`/api/likes`, { id });
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: bikeToastId });
    },
    onSuccess: (data) => {
      queryCLient.invalidateQueries(["bikes"]);
      queryCLient.invalidateQueries(["userBikes"]);
      if (data.status === 200) setLiked(true);
      if (data.status === 201) setLiked(false);
    },
  });

  return (
    <div>
      <span className="mr-1">{count.likes}</span>
      <button
        onClick={() => mutationLike.mutate()}
        className=" bg-transparent inline-block w-auto p-0 border-0 hover:bg-slate-500 transition-all duration-300 px-1"
      >
        {liked ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

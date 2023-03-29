"use client";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function CommentForm({ bikeId }) {
  const [comment, setComment] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryCLient = useQueryClient();
  let commToastId: string = "bikeToast";

  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`/api/comments`, { text: data, bikeId });
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: commToastId });
      setComment("");
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      toast.success("Comment added successfully", { id: commToastId });
      queryCLient.invalidateQueries(["bike"]);
      setComment("");
      setIsDisabled(false);
    },
  });

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Adding your comment", { id: commToastId });
    mutation.mutate(comment);
  };

  return (
    <div className="bg-gray-700 w-full p-10 mb-10 rounded-b-xl lg:w-1/2 lg:px-20">
      <form onSubmit={submitComment}>
        <textarea
          className="mb-3"
          value={comment}
          placeholder="description"
          onChange={(e) => setComment(e.target.value)}
        />

        <button disabled={isDisabled} className="mt-5">
          Add Comment
        </button>
      </form>
    </div>
  );
}

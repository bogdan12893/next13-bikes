"use client ";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function CommentItem({ comment }) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [editComment, setEditComment] = useState(comment.text);
  const queryCLient = useQueryClient();
  const { data: session } = useSession();
  let commToastId: string = "commToast";

  const handleIcon = isEdit ? "/svg/x-cancel.svg" : "/svg/edit-pencil.svg";

  const isCommentEdited =
    comment.createdAt !== comment.updatedAt
      ? `(edited: ${moment(comment.updatedAt).fromNow()})`
      : false;

  const mutationUpdate = useMutation({
    mutationFn: (data) => {
      return axios.patch(`/api/comments`, { ...comment, text: editComment });
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: commToastId });
      setIsDisabled(false);
      setIsEdit(false);
    },
    onSuccess: (data) => {
      toast.success("Comment updated successfully", { id: commToastId });
      queryCLient.invalidateQueries(["bike"]);
      setIsDisabled(false);
      setIsEdit(false);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/comments`, { data: comment });
    },
    onError: (error: Error | any) => {
      toast.error(error?.response?.data, { id: commToastId });
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      toast.success("Comment deleted successfully", { id: commToastId });
      queryCLient.invalidateQueries(["bike"]);
      setIsDisabled(false);
    },
  });

  const deleteComment = (comment) => {
    setIsDisabled(true);
    toast.loading("Deleting your comment", { id: commToastId });
    mutationDelete.mutate(comment);
  };

  const updateComment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toast.loading("Updating your comment", { id: commToastId });
    mutationUpdate.mutate(comment);
  };

  return (
    <div className=" bg-teal-600 p-7 mb-2 rounded-lg relative">
      {comment?.userId === session?.user.id && (
        <div>
          <button
            onClick={() => {
              setIsEdit(!isEdit);
            }}
            className="absolute w-auto p-0 bg-teal-400 rounded-lg right-1 top-1 hover:shadow-md hover:bg-teal-300 transition-all duration-300"
          >
            <Image src={handleIcon} alt="action icon" width={20} height={20} />
          </button>
          <button
            className="danger absolute -left-2 -top-2 p-0"
            disabled={isDisabled}
            onClick={() => deleteComment(comment)}
          >
            ✕
          </button>
        </div>
      )}

      {isEdit ? (
        <div>
          <form onSubmit={updateComment} className="relative">
            <textarea
              className="mb-3"
              value={editComment}
              placeholder="description"
              onChange={(e) => setEditComment(e.target.value)}
            />

            <button
              disabled={isDisabled}
              className="absolute w-auto p-1 bg-lime-500 rounded-lg right-4 -bottom-3 hover:shadow-md hover:bg-lime-300 transition-all duration-300"
            >
              <Image
                src="/svg/mark-done.svg"
                alt="action icon"
                width={20}
                height={20}
              />
            </button>
          </form>
        </div>
      ) : (
        <p>{comment.text}</p>
      )}
      <p className="text-xs text-right">
        {moment(comment.createdAt).fromNow()} by {comment.user.name}{" "}
        {isCommentEdited}
      </p>
    </div>
  );
}

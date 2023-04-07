"use client";
import CommentItem from "./CommentItem";

export default function CommentsList({ comments }) {
  return (
    <div className="bg-teal-800 w-full p-10 lg:w-1/2">
      <p className="font-bold text-xl mb-4 text-center">Comments</p>
      {comments.length > 0 ? (
        <div>
          {comments.map((comment) => {
            return <CommentItem key={comment.id} comment={comment} />;
          })}
        </div>
      ) : (
        <div>
          <p>No comments yet</p>
        </div>
      )}
    </div>
  );
}

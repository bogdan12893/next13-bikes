"use client";
import moment from "moment";

export default function CommentsList({ comments }) {
  return (
    <div className="bg-teal-800 w-full p-10 lg:w-1/2">
      <p className="font-bold text-xl mb-4 text-center">Comments</p>
      {comments.length > 0 ? (
        <div>
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className=" bg-teal-600 p-5 mb-2 rounded-lg"
              >
                <p>{comment.text}</p>
                <p className="text-xs text-right">
                  {moment(comment.createdAt).fromNow()} by {comment.user.name}
                </p>
              </div>
            );
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

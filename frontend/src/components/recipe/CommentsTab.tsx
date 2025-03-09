import React, { ChangeEvent } from "react";
import { Camera, Star, User } from "lucide-react";
import { CommentsTabProps } from "../../types/recipe";

const CommentsTab: React.FC<CommentsTabProps> = ({ 
  commentsList, 
  newComment, 
  setNewComment, 
  handleCommentSubmit 
}) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-5">Reviews and Comments</h2>
    <div className="mb-8 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium mb-3">Share Your Opinion</h3>
      <textarea
        value={newComment}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
        placeholder="Share your thoughts about this recipe..."
        className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 h-24"
      />
      <div className="flex flex-wrap justify-between mt-3">
        <div className="flex space-x-2 items-center">
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors">
            <Camera size={20} />
          </button>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={22}
                className="text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleCommentSubmit}
          className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Post Comment
        </button>
      </div>
    </div>
    
    <div className="space-y-4">
      {commentsList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment on this recipe.
        </div>
      ) : (
        commentsList.map((comment, index) => (
          <div
            key={index}
            className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <User size={18} />
              </div>
              <div className="ml-3">
                <div className="font-medium">{comment.user}</div>
                <div className="text-gray-500 text-xs">{comment.date}</div>
              </div>
              <div className="ml-auto flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="text-yellow-400"
                    fill={star <= 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{comment.text}</p>
            <div className="mt-3 flex space-x-4 text-sm">
              <button className="text-gray-500 hover:text-orange-500 transition-colors">
                Like
              </button>
              <button className="text-gray-500 hover:text-orange-500 transition-colors">
                Reply
              </button>
              <button className="text-gray-500 hover:text-orange-500 transition-colors">
                Share
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default CommentsTab;
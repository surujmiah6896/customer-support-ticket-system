
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { commentsAPI } from "../../services/APIService";
import { Toast } from "../../utils/toast";
import { Button } from "../../widgets/Button";
import { FaPlus } from "react-icons/fa";

const CommentList = ({ ticketId, comments, onCommentAdded }) => {
  console.log("comments", comments);

  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await commentsAPI.create(ticketId, { content: newComment });
      setNewComment("");
      onCommentAdded();
      Toast('Comment Successfully!');
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await commentsAPI.delete(ticketId, commentId);
      onCommentAdded();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Comments</h3>
      </div>

      {/* Comment Form */}
      <div className="px-6 py-4 border-b border-gray-200">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="comment" className="sr-only">
              Add a comment
            </label>
            <textarea
              id="comment"
              name="comment"
              rows="3"
              className="shadow-sm block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <div>
                <Button type="submit" disabled={loading || !newComment.trim()}>
                {" "}
                <FaPlus size={20}/>{loading ? "Adding..." : "Add Comment"}{" "}
                </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentList;

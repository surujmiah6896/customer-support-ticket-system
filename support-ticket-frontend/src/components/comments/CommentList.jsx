import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { commentsAPI } from "../../services/APIService";
import { Toast } from "../../utils/toast";
import { Button } from "../../widgets/Button";
import { FaBicycle, FaComment, FaPlus, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../tickets/ConfirmationModal";

const CommentList = ({ ticketId, comments, onCommentAdded }) => {
  console.log("comments", comments);

  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await commentsAPI.create(ticketId, { content: newComment });
      if (res.data && res.data.status) {
        setNewComment("");
        onCommentAdded();
        Toast("Comment Successfully!");
      } else {
        Toast("Comment Fail!", false);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingComment) return;

    setActionLoading(true);
    try {
      const res = await commentsAPI.delete(ticketId, deletingComment.id);
      if (res.data && res.data.status) {
        onCommentAdded();
        Toast("Delete Successfully!", false);
      } else {
        Toast("Delete Fail!", false);
      }
      setDeletingComment(null);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      Toast("Delete error!", false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (ticket) => {
    setDeletingComment(ticket);
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
                <FaPlus size={20} />
                {loading ? "Adding..." : "Add Comment"}{" "}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-gray-200">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {comment.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {(user?.role === 'admin' || comment.user_id === user?.id) && (
                  <div>
                    <Button
                      color="bg-red-500"
                      onClick={() => handleDelete(comment)}
                      disabled={actionLoading}
                    >
                      <FaTrash size={20} />
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 flex flex-col items-center">
            <FaComment size={20} />
            <p className="text-gray-500">No comments!</p>
          </div>
        )}
      </div>

      {deletingComment && (
        <ConfirmationModal
          show={!!deletingComment}
          onHide={() => setDeletingComment(null)}
          onConfirm={confirmDelete}
          title="Delete Ticket"
          message={`Are you sure you want to delete ticket "${deletingComment.content}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default CommentList;

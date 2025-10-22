
import { Button } from "../../widgets/Button";
import {  FaTimes, FaTrash } from "react-icons/fa";

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  if (!show) return null;

  const variantClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    primary: "bg-blue-600 hover:bg-blue-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <Button color="bg-gray-500" onClick={onHide} disabled={loading}>
              <FaTimes /> {cancelText}
            </Button>
            <Button
              color={variantClasses[variant]}
              onClick={onConfirm}
              disabled={loading}
            >
             <FaTrash/> {loading ? "Processing..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

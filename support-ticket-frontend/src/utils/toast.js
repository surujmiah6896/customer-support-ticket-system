import { toast } from "react-toastify";
export const Toast = (title) => {
  toast.success(title, {
    position: "top-right",
  });
  return true;
};

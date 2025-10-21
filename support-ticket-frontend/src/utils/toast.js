import { toast } from "react-toastify";
export const Toast = (title, status) => {
  if(status !== "delete"){
    toast.success(title, {
      position: "top-right",
    });
  }else{
    toast.error(title, {
      position: "top-right",
    });
  }
  return true;
};

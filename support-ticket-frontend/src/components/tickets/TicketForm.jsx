import React, { useEffect, useState } from "react";
import { ticketsAPI, authAPI } from "../../services/APIService";
import { useForm } from "react-hook-form";
import { FormGroup } from "../../widgets/FromGroup";
import { Button } from "../../widgets/Button";
import { Toast } from "../../utils/toast";
import { useAuth } from "../../contexts/AuthContext";
import { FaPlus, FaTimes } from "react-icons/fa";

const TicketForm = ({
  show,
  onHide,
  onTicketCreated,
  editTicket = null,
  onTicketUpdated,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm();

  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const { user } = useAuth();

  const assignedTo = watch("assignedTo");

  useEffect(() => {
    if (show) {
      if (editTicket) {
        setIsEditing(true);
        setValue("subject", editTicket.subject);
        setValue("description", editTicket.description);
        setValue("category", editTicket.category);
        setValue("priority", editTicket.priority);
        setValue("status", editTicket.status);
        setValue("assignedTo", editTicket.user_id || "");
      } else {
        setIsEditing(false);
        reset();
        setAttachment(null);
      }
      setError("");
    }
  }, [show, editTicket, reset, setValue]);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (show && user?.role === "admin") {
        setLoadingCustomers(true);
        try {
          const response = await authAPI.getCustomers();
          if (response.data && response.data.status){
            setCustomers(response.data.customers || []);
          } 
        } catch (err) {
          console.error("Failed to fetch customers:", err);
          setCustomers([]);
        } finally {
          setLoadingCustomers(false);
        }
      }
    };

    fetchCustomers();
  }, [show, user]);

  const onSubmit = async (data) => {
    try {
      setError("");

      const submitData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] && key !== "attachment") {
          if (key === "assignedTo") {
            submitData.append("user_id", data[key]);
          } else {
            submitData.append(key, data[key]);
          }
        }
      });

      if (attachment) {
        submitData.append("attachment", attachment);
      }

      if (!isEditing && user?.role === "admin" && !data.assignedTo) {
        submitData.append("createdBy", user.id);
      }

      if (isEditing && editTicket) {
        const res = await ticketsAPI.update(editTicket.id, submitData);
        if(res.data && res.data.status){
            onTicketUpdated?.();
            Toast("Ticket Updated Successfully!",true);
        }else{
          Toast("Ticket Updated Fail!", false);
        }
        
      } else {
       const res = await ticketsAPI.create(submitData);
       if (res.data && res.data.status) {
         onTicketCreated?.();
         Toast("Ticket Created Successfully!");
       } else {
         Toast("Ticket Created Fail!", false);
       }
      }

      reset();
      setAttachment(null);
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
    }
  };

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleCancel = () => {
    reset();
    setAttachment(null);
    setError("");
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-zinc-300 w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? "Edit Ticket" : "Create New Ticket"}
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormGroup
              label={"Subject"}
              type="text"
              {...register("subject", {
                required: "Subject is required",
                minLength: {
                  value: 3,
                  message: "Subject must be at least 3 characters",
                },
              })}
              error={errors.subject}
              placeholder={"Enter subject"}
              requiredStatus={true}
            />

            <FormGroup
              label={"Description"}
              type="textarea"
              rows="4"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              error={errors.description}
              placeholder={"Enter description"}
              requiredStatus={true}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormGroup
                label={"Category"}
                type="select"
                {...register("category", { required: "Category is required" })}
                error={errors.category}
                options={[
                  { value: "technical", label: "Technical" },
                  { value: "billing", label: "Billing" },
                  { value: "general", label: "General" },
                  { value: "support", label: "Support" },
                ]}
                requiredStatus={true}
              />

              <FormGroup
                label={"Priority"}
                type="select"
                {...register("priority", { required: "Priority is required" })}
                error={errors.priority}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
                requiredStatus={true}
              />
            </div>

            {/* Customer Assignment - only for admin */}
            {user?.role === "admin" && (
              <FormGroup
                label={"Assign to Customer"}
                type="select"
                {...register("assignedTo")}
                error={errors.assignedTo}
                options={[
                  { value: "", label: "Select Customer" },
                  ...customers.map((customer) => ({
                    value: customer.id,
                    label: `${customer.name}`,
                  })),
                ]}
                disabled={loadingCustomers}
              />
            )}

            {loadingCustomers && (
              <div className="text-sm text-gray-500">Loading customers...</div>
            )}

            {isEditing && user?.role === "admin" && (
              <FormGroup
                label={"Status"}
                type="select"
                {...register("status", { required: "Status is required" })}
                error={errors.status}
                options={[
                  { value: "open", label: "Open" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" },
                ]}
              />
            )}

            <FormGroup
              label={"Attachment"}
              type="file"
              onChange={handleAttachmentChange}
              error={null}
            />

            {isEditing && editTicket?.attachment && (
              <div className="text-sm text-gray-600">
                <p>Current Attachment: {editTicket.attachment}</p>
                <p className="text-xs text-gray-500">
                  Upload a new file to replace current attachment
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" color="bg-gray-500" onClick={handleCancel}>
                <FaTimes /> Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                <FaPlus />
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Ticket"
                  : "Create Ticket"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;

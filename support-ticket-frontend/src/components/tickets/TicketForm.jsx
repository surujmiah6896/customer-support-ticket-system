import React, { useState } from "react";
import { ticketsAPI } from "../../services/APIService";
import { useForm } from "react-hook-form";
import { FormGroup } from "../../widgets/FromGroup";
import { Button } from "../../widgets/Button";
import { Toast } from '../../utils/toast';

const TicketForm = ({ show, onHide, onTicketCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState(null);

  const onSubmit = async (data) => {
   
    try {
      setError("");

      const submitData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] && key !== "attachment") {
          submitData.append(key, data[key]);
        }
      });

      if (attachment) {
        submitData.append("attachment", attachment);
      }

      await ticketsAPI.create(submitData);
      onTicketCreated();
      reset();
      setAttachment(null);
      onHide();
      Toast('Ticket Create Successfully!');
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
    <div className="fixed inset-0 bg-transparent bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-zinc-300 w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Create New Ticket
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
              />
            </div>

            <FormGroup
              label={"Attachment"}
              type="file"
              onChange={handleAttachmentChange}
              error={null}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" color="bg-gray-500" onClick={handleCancel}>
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </Button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;

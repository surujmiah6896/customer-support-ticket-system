
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ticketsAPI } from "../../services/APIService";
import Loading from "../../widgets/Loading";
import Error from "../../widgets/Error";
import { Button } from "../../widgets/Button";
import Badge from "../../widgets/Badge";
import {  FaDoorOpen, FaPlus, FaWindowClose } from "react-icons/fa";
import CustomerRawInfo from "../../widgets/CustomerRawInfo";
import CommentList from "../comments/CommentList";
import ChatRoom from "../chat/ChatRoom";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      const response = await ticketsAPI.getById(id);
      setTicket(response.data.ticket);
    } catch (err) {
      setError("Failed to load ticket");
      console.error("Error loading ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (newStatus) => {
    try {
      const response = await ticketsAPI.update(id, { status: newStatus });
      setTicket(response.data.ticket);
    } catch (err) {
      setError("Failed to update ticket status:" + err);
    }
  };

  if (loading) {
   return  <Loading/>
  }

  if (error) {
   return <Error error={error} />;
  }

  if (!ticket) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ticket not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-blue-600 hover:text-blue-500 font-medium"
        >
          ← Back to Tickets
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {ticket.subject}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge title={ticket.status} />
              <Badge title={ticket.priority} />
              <Badge title={ticket.category} />
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="flex gap-2">
              <select
                value={ticket.status}
                onChange={(e) => updateTicketStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["details", "comments", "chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`${
            activeTab === "details" ? "lg:col-span-2" : "lg:col-span-3"
          }`}
        >
          {activeTab === "details" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Ticket Details
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Description
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <CustomerRawInfo
                      title={"Customer"}
                      value={ticket.user?.name}
                    />

                    <CustomerRawInfo
                      title={"Assigned Admin"}
                      value={ticket.assigned_admin?.name}
                    />

                    <CustomerRawInfo
                      title={"Created"}
                      value={new Date(ticket.created_at).toLocaleString()}
                    />

                    <CustomerRawInfo
                      title={"Last Updated"}
                      value={new Date(ticket.updated_at).toLocaleString()}
                    />

                    {ticket.attachment && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Attachment
                        </h4>
                        <a
                          href={`${import.meta.env.VITE_APP_API_URL}/${
                            ticket.attachment
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:text-blue-500"
                        >
                          Download Attachment
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <CommentList
              ticketId={id}
              comments={ticket.comments}
              onCommentAdded={loadTicket}
            />
          )}

          {activeTab === "chat" && <ChatRoom ticketId={id} />}
        </div>

        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <Button onClick={() => setActiveTab("comments")}>
                  <FaPlus size={20} />
                  Add Comment
                </Button>

                <Button
                  color="bg-green-600"
                  onClick={() => setActiveTab("chat")}
                >
                  <FaDoorOpen size={20} />
                  Open Chat
                </Button>

                {user?.role === 'admin' && (
                  <Button
                    color="bg-gray-600"
                    onClick={() => updateTicketStatus("closed")}
                  >
                    <FaWindowClose size={20} />
                    Close Ticket
                  </Button>
                )}
              </div>
            </div>

            {/* Ticket Info */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Ticket Info
                </h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ticket ID:</span>
                  <span className="text-sm font-medium">#{ticket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Priority:</span>
                  <Badge title={ticket.priority} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category:</span>
                  <Badge title={ticket.category} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <Badge title={ticket.status} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;

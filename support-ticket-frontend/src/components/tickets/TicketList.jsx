import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TicketForm from "./TicketForm";
import { ticketsAPI } from "../../services/APIService";
import { FaTicketAlt, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Loading from "../../widgets/Loading";
import Badge from "../../widgets/Badge";
import { Button } from "../../widgets/Button";
import { Toast } from "../../utils/toast";
import ConfirmationModal from "./ConfirmationModal";
// import ConfirmationModal from "../../widgets/ConfirmationModal"; // New component

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await ticketsAPI.getAll();
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
  };

  const handleUpdateTicket = async () => {
    await loadTickets(); 
    setEditingTicket(null);
  };

  const handleDelete = (ticket) => {
    setDeletingTicket(ticket);
  };

  const confirmDelete = async () => {
    if (!deletingTicket) return;

    setActionLoading(true);
    try {
      await ticketsAPI.delete(deletingTicket.id);
      setTickets((prev) =>
        prev.filter((ticket) => ticket.id !== deletingTicket.id)
      );
      setDeletingTicket(null);
      Toast('Delete Successfully!', true);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      Toast("Delete error!", true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await ticketsAPI.update(ticketId, { status: newStatus });
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? response.data.ticket : ticket
        )
      );
      Toast('Update Successfully!', true);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      Toast("Update error!", true);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
        {!user?.isAdmin && (
          <div className="w-[80]">
            <Button color="bg-blue-600" onClick={() => setShowForm(true)}>
              Create New Ticket
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="hover:bg-gray-50 transition-colors">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-sm font-medium text-blue-600 truncate hover:text-blue-800"
                    >
                      {ticket.subject}
                    </Link>
                    <Badge title={ticket.priority} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge title={ticket.status} />

                    {user?.role === "admin" && (
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusUpdate(ticket.id, e.target.value)
                        }
                        disabled={actionLoading}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 ml-2">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <FaEye size={16} />
                      </Link>

                      {(user?.role === "admin" ||
                        ticket.user_id === user?.id) && (
                        <>
                          <button
                            onClick={() => handleEdit(ticket)}
                            disabled={actionLoading}
                            className="text-gray-400 hover:text-green-600 p-1 rounded transition-colors disabled:opacity-50"
                            title="Edit Ticket"
                          >
                            <FaEdit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(ticket)}
                            disabled={actionLoading}
                            className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors disabled:opacity-50"
                            title="Delete Ticket"
                          >
                            <FaTrash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-6">
                    <p className="flex items-center text-sm text-gray-500">
                      Category: {ticket.category}
                    </p>
                    {user?.role === "admin" && ticket.user && (
                      <p className="flex items-center text-sm text-gray-500">
                        Customer: {ticket?.user?.name}
                      </p>
                    )}
                    {ticket.assigned_to && (
                      <p className="flex items-center text-sm text-gray-500">
                        Assigned to:{" "}
                        {ticket.assigned_user?.name || "Unassigned"}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                    {ticket.updated_at !== ticket.created_at && (
                      <p className="ml-4">
                        Updated{" "}
                        {new Date(ticket.updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <FaTicketAlt size={20} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No tickets found
            </h3>
            <p className="text-gray-500 mt-1">
              {user?.isCustomer
                ? "Create your first support ticket to get started."
                : "No tickets have been created yet."}
            </p>
          </div>
        )}
      </div>

      {/* create and edit modal */}
      <TicketForm
        show={showForm || !!editingTicket}
        onHide={() => {
          setShowForm(false);
          setEditingTicket(null);
        }}
        onTicketCreated={loadTickets}
        editTicket={editingTicket}
        onTicketUpdated={handleUpdateTicket}
        
      />

      {/* delete modal */}
      {deletingTicket && (
        <ConfirmationModal
          show={!!deletingTicket}
          onHide={() => setDeletingTicket(null)}
          onConfirm={confirmDelete}
          title="Delete Ticket"
          message={`Are you sure you want to delete ticket "${deletingTicket.subject}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default TicketList;

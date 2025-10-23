import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import TicketForm from "./TicketForm";
import { ticketsAPI } from "../../services/APIService";
import { FaTicketAlt, FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import Loading from "../../widgets/Loading";
import Badge from "../../widgets/Badge";
import { Button } from "../../widgets/Button";
import { Toast } from "../../utils/toast";
import ConfirmationModal from "./ConfirmationModal";
import CountStatus from "../../widgets/CountStatus";

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
      const res = await ticketsAPI.getAll();
      if (res.data && res.data.status){
        setTickets(res.data.tickets);
      } else{
        setTickets([]);
      }
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
     const res = await ticketsAPI.delete(deletingTicket.id);
     if(res.data && res.data.status){
       setTickets((prev) =>
         prev.filter((ticket) => ticket.id !== deletingTicket.id)
       );
       setDeletingTicket(null);
       Toast("Delete Successfully!", true);
     }else{
        Toast("Delete error!", false);
     }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      Toast("Delete error!", false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await ticketsAPI.update(ticketId, { status: newStatus });
      if(res.data && res.data.status){
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === ticketId ? res.data.ticket : ticket
          )
        );
        Toast("Update Successfully!", true);
      }else{
        Toast("Update Fail!", false);
      }
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

  const status = [
    { title: "Open", type: "open" },
    { title: "In Progress", type: "in_progress" },
    { title: "Resolved", type: "resolved" },
    { title: "Closed", type: "closed" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Support Tickets
            </h1>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              {status && status.length > 0
                ? status.map((item, index) => (
                    <div key={index} className="text-sm sm:text-base">
                      <CountStatus
                        tickets={tickets}
                        title={item.title}
                        type={item.type}
                      />
                    </div>
                  ))
                : " "}
            </div>
          </div>

          {user?.role !== 'admin' && (
            <div className="sm:self-start w-full sm:w-auto">
              <Button
                color="bg-blue-600"
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto justify-center"
              >
                <FaPlus className="sm:mr-1" />
                <span>Create</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="hover:bg-gray-50 transition-colors border-b border-gray-200"
            >
              <div className="px-3 py-3 sm:px-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 line-clamp-1 flex-1"
                    >
                      {ticket.subject}
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge title={ticket.status} size="sm" />
                      {user?.role === "admin" && (
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusUpdate(ticket.id, e.target.value)
                          }
                          disabled={actionLoading}
                          className="text-xs border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500  sm:block"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{ticket.category}</span>
                      <Badge title={ticket.priority} size="xs" />
                      {ticket.assigned_to && (
                        <span className="hidden sm:inline">
                          • {ticket.assigned_user?.name || "Unassigned"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-gray-400 hover:text-blue-600 p-1 rounded"
                        title="View"
                      >
                        <FaEye size={14} />
                      </Link>
                      {(user?.role === "admin" ||
                        ticket.user_id === user?.id) && (
                        <>
                          <button
                            onClick={() => handleEdit(ticket)}
                            className="text-gray-400 hover:text-green-600 p-1 rounded"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(ticket)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1">
                    <p className="text-xs text-gray-600 line-clamp-2 flex-1">
                      {ticket.description}
                    </p>
                    <div className="text-xs text-gray-500 flex-shrink-0">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </div>
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

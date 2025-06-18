import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import EditTicketModal from '../components/EditTicketModal';

export default function Tickets() {
  const { projectId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState({});
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingTicket, setEditingTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketsAndUsers = async () => {
      setLoading(true);
      const [ticketsRes, usersRes] = await Promise.all([
        supabase.from('tickets').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('id, email')
      ]);

      const users = usersRes.data || [];
      const map = {};
      users.forEach(user => {
        map[user.id] = user.email;
      });

      setTickets(ticketsRes.data || []);
      setUsersMap(map);
      setLoading(false);
    };

    fetchTicketsAndUsers();
  }, [projectId]);

  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    const { error } = await supabase.from('tickets').delete().eq('id', ticketId);
    if (error) {
      alert("Error deleting ticket: " + error.message);
    } else {
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) || ticket.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority ? ticket.priority === filterPriority : true;
    const matchesStatus = filterStatus ? ticket.status === filterStatus : true;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (loading) return <div className="p-6 bg-gray-100 min-h-screen">Loading tickets...</div>;

  return (
    <motion.div className="min-h-screen p-6 bg-gray-50 text-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tickets</h2>

        <div className="space-x-3">
          <Link
            to={`/projects/${projectId}/kanban`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium border"
          >
            Kanban View
          </Link>
          <Link
            to={`/projects/${projectId}/tickets/new`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
          >
            New Ticket
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="col-span-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No matching tickets found.</div>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTickets.map(ticket => (
            <motion.div
              key={ticket.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition p-5"
            >
              <div className="flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">
                    <Link to={`/projects/${projectId}/tickets/${ticket.id}`} className="text-blue-600 hover:underline">
                      {ticket.title}
                    </Link>
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 border ${
                    ticket.priority === 'Critical' ? 'border-red-400 text-red-600' :
                    ticket.priority === 'High' ? 'border-orange-400 text-orange-600' :
                    ticket.priority === 'Medium' ? 'border-yellow-400 text-yellow-600' :
                    'border-green-400 text-green-600'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {ticket.description}
                </p>

                <div className="flex justify-between flex-wrap items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded-full border bg-gray-50 text-gray-700 ${
                    ticket.status === 'To Do' ? 'border-gray-400' :
                    ticket.status === 'In Progress' ? 'border-yellow-400 text-yellow-600' :
                    ticket.status === 'Done' ? 'border-green-400 text-green-600' :
                    'border-gray-300'
                  }`}>
                    {ticket.status}
                  </span>

                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>👤 {usersMap[ticket.assignee] || 'Unassigned'}</span>
                    <span>📅 {new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 mt-3">
                  <button
                    onClick={() => navigate(`/projects/${ticket.project_id}/tickets/${ticket.id}/edit`)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 text-sm rounded-md border"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-sm rounded-md shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onUpdate={(updated) => {
            setTickets((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t))
            );
            setEditingTicket(null);
          }}
        />
      )}
    </motion.div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function EditTicket() {
  const { projectId, ticketId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('To Do');
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicketAndUsers = async () => {
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (ticketError) {
        setError(ticketError.message);
        return;
      }

      setTitle(ticket.title);
      setDescription(ticket.description);
      setPriority(ticket.priority);
      setStatus(ticket.status);
      setAssignee(ticket.assignee || '');

      const { data: userData } = await supabase
        .from('user_profiles')
        .select('id, email');

      setUsers(userData || []);
    };

    fetchTicketAndUsers();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { error: updateError } = await supabase
      .from('tickets')
      .update({
        title,
        description,
        priority,
        status,
        assignee: assignee || null,
      })
      .eq('id', ticketId);

    if (updateError) {
      toast.error(updateError.message);
    } else {
      toast.success(' Ticket updated!');
      navigate(`/projects/${projectId}/tickets`);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100 text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-black">
        <Link
          to={`/projects/${projectId}/tickets`}
          className="text-black hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Tickets
        </Link>

        <h2 className="text-3xl font-bold mb-6 text-black">Edit Ticket</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black">Title</label>
            <input
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Description</label>
            <textarea
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="Describe the issue"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Priority</label>
              <select
                className="mt-1 w-full border border-gray-300 p-3 rounded-lg text-black"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Status</label>
              <select
                className="mt-1 w-full border border-gray-300 p-3 rounded-lg text-black"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Assignee</label>
            <select
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg text-black"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
}

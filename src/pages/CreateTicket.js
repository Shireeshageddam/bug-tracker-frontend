import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function CreateTicket() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('user_profiles').select('id, email');
      if (!error) setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description) {
      setError('Please fill in all fields.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from('tickets').insert([
      {
        title,
        description,
        priority,
        status: 'To Do',
        project_id: projectId,
        created_by: user.id,
        assignee: assignee || null,
      },
    ]);

    if (insertError) {
      toast.error(insertError.message);
    } else {
      toast.success('✅ Ticket created successfully!');
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

        <h2 className="text-3xl font-bold mb-6 text-black">Create New Ticket</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black">Title</label>
            <input
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              <label className="block text-sm font-medium text-black">Assignee</label>
              <select
                className="mt-1 w-full border border-gray-300 p-3 rounded-lg text-black"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Assign to (optional)</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300"
          >
            Create Ticket
          </button>
        </form>
      </div>
    </motion.div>
  );
}

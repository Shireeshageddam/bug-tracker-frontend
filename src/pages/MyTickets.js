import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';


export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      setUserId(user.id);

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('assignee', user.id)
        .order('created_at', { ascending: false });

      if (!error) setTickets(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const updateStatus = async (ticketId, newStatus) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus })
      .eq('id', ticketId);

    if (!error) {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    }
  };

  if (loading) return <div className="p-6">Loading your tickets...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎟️ My Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets assigned to you.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 border rounded-md bg-white shadow flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              <p className="text-sm text-gray-600">{ticket.description}</p>
              <div className="flex gap-3 items-center">
                <span className="text-sm font-medium">Status:</span>
                <select
                  value={ticket.status}
                  onChange={(e) => updateStatus(ticket.id, e.target.value)}
                  className="p-1 border rounded-md"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

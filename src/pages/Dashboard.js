import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  'To Do': '#8884d8',
  'In Progress': '#82ca9d',
  'Done': '#ffc658',
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: projectsData }, { data: ticketsData }] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('tickets').select('*'),
    ]);
    setProjects(projectsData || []);
    setTickets(ticketsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ticketStatusData = ['To Do', 'In Progress', 'Done'].map(status => ({
    name: status,
    value: tickets.filter(t => t.status === status).length,
  }));

  const lastProject = projects[0];

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 bg-gradient-to-tr from-slate-100 via-white to-slate-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📊 Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-700">{projects.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Tickets</h3>
          <p className="text-3xl font-bold text-purple-700">{tickets.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Open Tickets</h3>
          <p className="text-3xl font-bold text-green-700">
            {tickets.filter(t => t.status !== 'Done').length}
          </p>
        </div>
      </div>

      {/* Ticket Status Pie Chart */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Ticket Status Overview</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={ticketStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {ticketStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Activity</h3>
        {lastProject ? (
          <div className="text-gray-600">
            🆕 Last Project Created: <strong>{lastProject.title}</strong> <br />
            📅 {new Date(lastProject.created_at).toLocaleDateString()}
          </div>
        ) : (
          <p className="text-gray-500">No recent projects yet.</p>
        )}
      </div>
    </div>
  );
}

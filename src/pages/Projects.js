import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProjects(data);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("❗ Are you sure you want to delete this project?");
    if (!confirm) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
      alert("✅ Project deleted successfully.");
    } else {
      alert("❌ Failed to delete: " + error.message);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-br from-[#f0f4f8] to-[#dbeafe] text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight mb-2">📁 Projects Dashboard</h2>
        <Link
          to="/projects/new"
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow-md transition transform hover:scale-105"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-gray-500 text-lg text-center mt-20">No projects yet. Start by creating one! 🚀</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/projects/${project.id}/tickets`)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  🎟 View Tickets
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

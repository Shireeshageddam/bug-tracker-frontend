import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthProvider';

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    const { error } = await supabase.from('projects').insert([{ title, description,  created_by: user?.id},]);

    if (!error) {
      alert("✅ Project created successfully.");
      navigate('/projects');
    } else {
      alert("❌ Failed to create project: " + error.message);
    }
  };

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">🚀 Create New Project</h2>
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter project title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={5}
              placeholder="Enter project description"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300"
          >
            Create Project
          </button>
        </form>
      </div>
    </motion.div>
  );
}

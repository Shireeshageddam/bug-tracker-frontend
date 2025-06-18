
import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function EditTicketModal({ ticket, onClose, onUpdate }) {
  const [form, setForm] = useState({
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('tickets')
      .update(form)
      .eq('id', ticket.id);
    setSaving(false);
    if (error) return alert('Failed to update ticket');
    onUpdate({ ...ticket, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded mb-3"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded mb-3"
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

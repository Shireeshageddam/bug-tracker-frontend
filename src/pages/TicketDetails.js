import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function TicketDetails() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user);

      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      const { data: commentData } = await supabase
        .from('comments')
        .select('id, content, user_id, created_at, user_profiles(email)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      setTicket(ticketData);
      setComments(commentData || []);
      setLoading(false);
    };

    fetchDetails();
  }, [ticketId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) return alert("You must be logged in to post a comment.");

    const { error } = await supabase.from('comments').insert([
      {
        ticket_id: ticketId,
        user_id: user.id,
        content: newComment.trim(),
      },
    ]);

    if (error) return alert("Failed to post comment: " + error.message);

    setNewComment('');
    fetchComments();
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) return alert("Failed to delete comment: " + error.message);
    fetchComments();
  };

  const handleEditComment = async (comment) => {
    const updated = prompt("Edit your comment:", comment.content);
    if (!updated || updated.trim() === comment.content) return;

    const { error } = await supabase
      .from('comments')
      .update({ content: updated.trim() })
      .eq('id', comment.id);

    if (error) return alert("Failed to update comment: " + error.message);
    fetchComments();
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, content, user_id, created_at, user_profiles(email)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    setComments(data || []);
  };

  if (loading) return <p className="p-4 text-gray-500 animate-pulse">Loading ticket details...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <Link
          to={`/projects/${ticket.project_id}/tickets`}
          className="text-sm text-gray-600 hover:text-indigo-800 font-medium underline"
        >
          ← Back to Tickets
        </Link>

        <h1 className="text-4xl font-extrabold text-gray-700 mt-4 mb-2 tracking-tight">
          {ticket.title}
        </h1>
        <p className="text-gray-600 text-lg border-l-4 border-indigo-500 pl-4 italic mb-6">
          {ticket.description}
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Comments</h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 mb-6">No comments yet. Be the first to add one!</p>
          ) : (
            <ul className="space-y-4 mb-6">
              {comments.map((c) => (
                <li key={c.id} className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center text-sm text-indigo-900 font-semibold mb-1">
                    <span>{c.user_profiles?.email || 'Unknown User'}</span>
                    <span className="text-xs text-indigo-500 font-normal">
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">{c.content}</p>

                  {user?.id === c.user_id && (
                    <div className="flex justify-end gap-3 mt-2 text-sm text-gray-500">
                      <button
                        onClick={() => handleEditComment(c)}
                        className="hover:underline hover:text-indigo-800"
                      >
                         Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="hover:underline hover:text-red-500"
                      >
                         Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddComment} className="mt-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add a Comment</label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                🚀 Post Comment
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

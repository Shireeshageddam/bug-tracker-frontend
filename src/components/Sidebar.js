import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import {
  Menu,
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Plus,
  Bug,
  FilePlus
} from 'lucide-react';

export default function Sidebar({ isMobile = false, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract projectId from URL
  const match = location.pathname.match(/\/projects\/([^/]+)/);
  const projectId = match ? match[1] : null;

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Projects', icon: <FolderKanban size={18} />, path: '/projects' },
    { name: 'New Project', icon: <Plus size={18} />, path: '/projects/new' },
  ];

  // ✅ Ticket links only if projectId is found
  if (projectId) {
    navItems.push(
      { name: 'Tickets', icon: <Bug size={18} />, path: `/projects/${projectId}/tickets` },
      { name: 'New Ticket', icon: <FilePlus size={18} />, path: `/projects/${projectId}/tickets/new` }
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 
      ${isMobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'} shadow-sm`}
    >
      {!isMobile && (
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className={`text-lg font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap transition-all duration-300 
            ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
          >
            🐞 Bug Tracker
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 dark:text-gray-300"
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-all w-full"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
}

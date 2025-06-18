import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';


export default function Layout({ children, projectTitle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
   

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Bug Tracker
              </h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={22} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <Sidebar isMobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={22} className="text-gray-700 dark:text-gray-200" />
          </button>
          <span className="text-base font-medium text-blue-600 dark:text-blue-400">
            Bug Tracker
          </span>
        </div>

        {/* Topbar (always visible) */}
        <Topbar />

        {/* Main content area */}
        <main className="flex-1 px-6 py-4">
          
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}

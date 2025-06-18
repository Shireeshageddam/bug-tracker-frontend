// src/components/Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumb({ projectTitle }) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const paths = segments.map((_, index) => `/${segments.slice(0, index + 1).join('/')}`);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex flex-wrap items-center space-x-1">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="mx-1">/</span>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          let label = segment;

          // Replace project ID with project title if available
          if (segment.match(/^[0-9a-fA-F-]{36}$/) && projectTitle) {
            label = projectTitle;
          } else if (segment.match(/^[0-9a-fA-F-]{36}$/) && !projectTitle) {
            label = '...'; // Loading state
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }

          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link to={paths[index]} className="text-blue-600 hover:underline">
                    {label}
                  </Link>
                  <span className="mx-1">/</span>
                </>
              ) : (
                <span className="text-gray-800">{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

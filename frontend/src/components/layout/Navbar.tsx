'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Personal Assistant
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/agenda"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Agenda
            </Link>
            <Link
              href="/settings"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

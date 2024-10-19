'use client'

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, ChevronDown, LogOut, UserCircle } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Incidents' },
    { href: '/dashboard/map', label: 'Map' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo placeholder */}
          <Link href="/dashboard" className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center">
            <span className="font-bold text-xl">L</span>
          </Link>
          
          {/* Navigation items */}
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span
                    className={`cursor-pointer py-2 ${
                      isActive(item.href)
                        ? 'border-b-2 border-white font-semibold'
                        : 'hover:text-blue-300'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 hover:text-blue-300 focus:outline-none"
          >
            <User size={20} />
            <span>John Doe</span>
            <ChevronDown size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
              <Link href="/dashboard/account" className="block px-4 py-2 hover:bg-blue-100 cursor-pointer">
                <UserCircle className="inline-block mr-2" size={16} />
                Account Details
              </Link>
              <Link href="/logout" className="block px-4 py-2 hover:bg-blue-100 cursor-pointer">
                <LogOut className="inline-block mr-2" size={16} />
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
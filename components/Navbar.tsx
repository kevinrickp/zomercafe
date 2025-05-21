'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Pastikan kamu install lucide-react

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/reservation', label: 'Reservation' },
  { href: '/order', label: 'Order' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-600 tracking-wide">Zomer Cafe</h1>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          {links.map(({ href, label }) => (
            <li key={href} className="relative group">
              <Link
                href={href}
                className={`transition-colors duration-300 ${
                  pathname === href ? 'text-orange-600' : 'text-gray-700'
                }`}
              >
                {label}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <ul className="md:hidden px-6 pb-4 space-y-3 bg-white animate-fade-in">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block py-1 transition-colors ${
                  pathname === href ? 'text-orange-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { BookOpen, Users, RotateCcw, AlertCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/books', label: 'Books', icon: BookOpen },
    { href: '/members', label: 'Members', icon: Users },
    { href: '/issue-return', label: 'Issue/Return', icon: RotateCcw },
    { href: '/alerts', label: 'Alerts', icon: AlertCircle },
  ];

  return (
    <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white">Library Hub</span>
              <p className="text-[10px] text-zinc-500 -mt-1">Modern Library OS</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
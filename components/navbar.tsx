'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Users, RotateCcw, AlertCircle, Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/books', label: 'Books', icon: BookOpen },
    { href: '/members', label: 'Members', icon: Users },
    { href: '/issue-return', label: 'Issue/Return', icon: RotateCcw },
    { href: '/alerts', label: 'Alerts', icon: AlertCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-110">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:to-fuchsia-300 transition-all">
                Library Hub
              </span>
              <p className="text-[10px] text-zinc-500 -mt-0.5 tracking-widest">NEXT-GEN LIBRARY OS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300 overflow-hidden"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>

                  {/* Glowing underline on hover & active */}
                  <div className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:w-8/12 -translate-x-1/2 transition-all duration-300" />
                  
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-all" />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-3xl"
          >
            <div className="px-6 py-8 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
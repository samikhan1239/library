'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { BookOpen, Users, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

interface Stats {
  totalBooks: number;
  totalMembers: number;
  issuedBooks: number;
}

const statCards = [
  { title: "Total Books", key: "totalBooks" as keyof Stats, icon: BookOpen, color: "violet", valueColor: "text-violet-400" },
  { title: "Members", key: "totalMembers" as keyof Stats, icon: Users, color: "cyan", valueColor: "text-cyan-400" },
  { title: "Currently Issued", key: "issuedBooks" as keyof Stats, icon: TrendingUp, color: "fuchsia", valueColor: "text-fuchsia-400" },
];

const quickModules = [
  { href: "/books", label: "Inventory", desc: "Add, edit & search books", icon: BookOpen, accent: "violet" },
  { href: "/members", label: "Community", desc: "Manage members & profiles", icon: Users, accent: "cyan" },
  { href: "/issue-return", label: "Transactions", desc: "Issue or return books", icon: TrendingUp, accent: "fuchsia" },
  { href: "/alerts", label: "Smart Alerts", desc: "Overdues & reminders", icon: Clock, accent: "rose" },
];

export default function Home() {
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, totalMembers: 0, issuedBooks: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const issues = JSON.parse(localStorage.getItem('issues') || '[]');

    const issuedBooks = issues.filter((i: any) => !i.returnDate).length;

    setStats({ 
      totalBooks: books.length, 
      totalMembers: members.length, 
      issuedBooks 
    });
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(#4f46e510_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-fuchsia-950/20" />

      <main className="relative max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
        {/* HERO SECTION - Kept as requested */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl"
            >
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="uppercase tracking-[4px] text-sm font-medium text-emerald-400">Next-Gen Library OS</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-none">
              The Future of<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300">
                Library Management
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-zinc-400 max-w-xl">
              Elegant interface. Powerful insights. Zero hassle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/books" className="px-8 py-4 bg-white text-black font-semibold rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition text-base sm:text-lg">
                Browse Collection <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/issue-return" className="px-8 py-4 border border-white/30 hover:border-white/60 rounded-2xl transition text-base sm:text-lg text-center">
                Quick Issue
              </a>
            </div>
          </div>

          {/* Floating Book Visual */}
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              rotateX: [0, 10, 0],
              rotateY: [0, 15, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="flex-1 relative hidden lg:block"
          >
            <div className="relative w-80 h-96 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl shadow-2xl shadow-violet-500/50 rotate-12" />
              <div className="absolute inset-4 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10">
                <BookOpen className="w-32 h-32 text-white/80" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-zinc-800/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 text-sm">
                1,284 books • 87 online
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Stats Section */}
        <div className="mb-20 sm:mb-24">
          <h2 className="text-3xl font-semibold tracking-tight mb-8 sm:mb-10 px-1">Library Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {statCards.map((card, i) => {
                const Icon = card.icon;
                const value = stats[card.key];

                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 80, scale: 0.92 }}
                    animate={{ 
                      opacity: loaded ? 1 : 0, 
                      y: loaded ? 0 : 80,
                      scale: loaded ? 1 : 0.92 
                    }}
                    transition={{ 
                      delay: i * 0.08, 
                      duration: 0.9, 
                      type: "spring", 
                      bounce: 0.35 
                    }}
                    whileHover={{ y: -10, scale: 1.02 }} // Safe hover
                    className="group relative"
                  >
                    <motion.div
                      className="relative h-full overflow-hidden rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-3xl p-8 sm:p-9 shadow-2xl"
                      whileHover={{ 
                        boxShadow: `0 0 70px -15px rgb(139 92 246 / 0.4)` 
                      }}
                    >
                      <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-${card.color}-400 via-${card.color}-500 to-transparent transition-all duration-700 group-hover:w-[115%] group-hover:from-${card.color}-500`} />

                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-${card.color}-500/10 via-transparent to-transparent rounded-3xl`} />

                      <div className="absolute inset-0 border border-white/5 rounded-3xl group-hover:border-white/10 transition-colors" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-8 sm:mb-10">
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 8 }}
                            className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10`}
                          >
                            <Icon className={`h-10 w-10 sm:h-11 sm:w-11 text-${card.color}-400`} />
                          </motion.div>

                          <div className="text-right">
                            <span className="text-xs uppercase tracking-[3px] font-mono text-zinc-500">LIVE</span>
                            <div className="mt-1 text-emerald-400 text-xs font-medium">↑14%</div>
                          </div>
                        </div>

                        <div className={`text-5xl sm:text-[4.2rem] leading-none font-semibold tabular-nums tracking-[-3px] ${card.valueColor} mb-2`}>
                          {loaded ? (
                            <CountUp end={value} duration={2.6} separator="," delay={0.2} />
                          ) : "0"}
                        </div>

                        <p className="text-xl sm:text-2xl font-medium text-zinc-200 tracking-tight">
                          {card.title}
                        </p>
                      </div>

                      <div className={`absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-${card.color}-500/10 blur-3xl rounded-full -translate-y-8 translate-x-12 opacity-0 group-hover:opacity-70 transition-opacity`} />
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Access - Responsive & Mobile Friendly */}
        <div className="px-1">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Quick Access</h2>
            <p className="hidden sm:block text-zinc-500 text-sm">Tap any module to begin</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {quickModules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.a
                  key={i}
                  href={mod.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -6 }}
                  whileTap={{ scale: 0.97 }} // Better for mobile tap
                  className="group relative p-7 sm:p-9 bg-zinc-900/70 border border-white/10 hover:border-white/30 rounded-3xl flex flex-col h-full overflow-hidden active:scale-[0.985] transition-all duration-300"
                >
                  {/* Hover Glow - Only visible on hover (desktop) */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${mod.accent}-500/10 to-transparent opacity-0 md:group-hover:opacity-100 transition-all duration-500`} />

                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-${mod.accent}-500 to-${mod.accent}-600 flex items-center justify-center mb-7 shadow-lg transition-transform duration-300 group-active:scale-95`}>
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3 text-white">
                    {mod.label}
                  </h3>

                  <p className="text-zinc-400 flex-1 text-[15px] leading-relaxed mb-6">
                    {mod.desc}
                  </p>

                  <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                    Open Module 
                    <ArrowRight className="ml-2 w-4 h-4 transition group-hover:translate-x-1" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </main>
     
    </div>
  );
}
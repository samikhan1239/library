'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { BookOpen, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup'; // Optional: npm install react-countup

interface Stats {
  totalBooks: number;
  totalMembers: number;
  issuedBooks: number;
}

const statCards = [
  {
    title: "Total Books",
    key: "totalBooks" as keyof Stats,
    icon: BookOpen,
    color: "from-violet-500 to-fuchsia-500",
    bgGlow: "violet",
    subtitle: "In collection",
  },
  {
    title: "Members",
    key: "totalMembers" as keyof Stats,
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgGlow: "blue",
    subtitle: "Active members",
  },
  {
    title: "Active Issues",
    key: "issuedBooks" as keyof Stats,
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    bgGlow: "purple",
    subtitle: "Books currently out",
  },
];

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const issues = JSON.parse(localStorage.getItem('issues') || '[]');

    const issuedBooks = issues.filter((issue: any) => !issue.returnDate).length;

    setStats({
      totalBooks: books.length,
      totalMembers: members.length,
      issuedBooks,
    });

    // Trigger entrance animation
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white overflow-hidden">
      <Navbar />

      {/* Subtle animated background grid */}
      <div className="fixed inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[length:40px_40px] opacity-30 pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-6 py-12 sm:py-20">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Library OS v2.0</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
            Library Management
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Elegant. Intelligent. Effortless.<br />
            Manage your entire library with style.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {statCards.map((card, index) => {
              const Icon = card.icon;
              const value = stats[card.key];

              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 60, scale: loaded ? 1 : 0.95 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  {/* Glow layer */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${card.color} rounded-3xl opacity-20 group-hover:opacity-40 blur-2xl transition-all duration-500`} />

                  <Card className="relative h-full bg-zinc-900/80 border-white/10 backdrop-blur-2xl overflow-hidden rounded-3xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-zinc-400 tracking-widest">
                          {card.title.toUpperCase()}
                        </div>
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} bg-opacity-10`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-2">
                      <div className="text-7xl font-semibold tabular-nums tracking-tighter mb-2">
                        {loaded ? (
                          <CountUp start={0} end={value} duration={1.8} separator="," />
                        ) : (
                          "0"
                        )}
                      </div>

                      <p className="text-zinc-400 text-base">{card.subtitle}</p>
                    </CardContent>

                    {/* Subtle bottom accent line */}
                    <div className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${card.color} group-hover:w-full transition-all duration-700`} />
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Quick Access</h2>
              <p className="text-zinc-400">Jump into any section instantly</p>
            </div>
            <a href="#" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
              View all modules
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/books", label: "Books", desc: "Manage inventory", icon: BookOpen, accent: "violet" },
              { href: "/members", label: "Members", desc: "Manage users", icon: Users, accent: "blue" },
              { href: "/issue-return", label: "Issue / Return", desc: "Track transactions", icon: TrendingUp, accent: "purple" },
              { href: "/alerts", label: "Alerts & Overdue", desc: "Stay on top", icon: TrendingUp, accent: "rose" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative p-8 rounded-3xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl hover:border-white/20 transition-all duration-300 flex flex-col"
                >
                  <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br from-${item.accent}-500/10 to-transparent w-fit`}>
                    <Icon className={`h-8 w-8 text-${item.accent}-400 group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-white transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-zinc-400 text-sm flex-1">{item.desc}</p>

                  <div className="mt-8 flex items-center text-xs uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">
                    Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
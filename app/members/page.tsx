'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Users, Mail, Phone, Hash, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberId: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [memberId, setMemberId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(savedMembers);
  }, []);

  const addMember = () => {
    if (!name || !email || !phone || !memberId) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      memberId: memberId.trim(),
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    localStorage.setItem('members', JSON.stringify(updatedMembers));

    setName('');
    setEmail('');
    setPhone('');
    setMemberId('');
  };

  const deleteMember = (id: string) => {
    const updatedMembers = members.filter(m => m.id !== id);
    setMembers(updatedMembers);
    localStorage.setItem('members', JSON.stringify(updatedMembers));
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(#4f46e510_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950/30 via-transparent to-blue-950/20" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl shadow-xl shadow-cyan-500/30 flex-shrink-0">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Library Members
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 mt-3 max-w-lg">
                Manage your community with elegance
              </p>
            </div>
          </div>
        </motion.div>

        {/* Add Member Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 sm:mb-16"
        >
          <Card className="bg-zinc-900/70 border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="pb-6 sm:pb-8 border-b border-white/10 px-5 sm:px-8">
              <CardTitle className="flex items-center gap-4 text-white">
                <div className="p-3 bg-cyan-500/10 rounded-2xl">
                  <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <span className="text-2xl sm:text-3xl font-semibold">Add New Member</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
                {/* Name */}
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                  <Input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 sm:h-14 rounded-2xl bg-zinc-950/70 border border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all text-base sm:text-lg"
                  />
                </div>

                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 sm:h-14 rounded-2xl bg-zinc-950/70 border border-white/10 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all text-base sm:text-lg"
                  />
                </div>

                {/* Phone */}
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
                  <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-12 h-12 sm:h-14 rounded-2xl bg-zinc-950/70 border border-white/10 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all text-base sm:text-lg"
                  />
                </div>

                {/* Member ID */}
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                  <Input
                    placeholder="Member ID"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="pl-12 h-12 sm:h-14 rounded-2xl bg-zinc-950/70 border border-white/10 text-white placeholder:text-zinc-500 font-mono focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all text-base sm:text-lg"
                  />
                </div>

                {/* Add Button */}
                <Button
                  onClick={addMember}
                  disabled={!name || !email || !phone || !memberId}
                  className="h-12 sm:h-14 rounded-2xl text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed w-full lg:w-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 sm:mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">All Members</h2>
            <div className="px-3 sm:px-4 py-1 bg-white/5 text-xs sm:text-sm rounded-full text-zinc-400 border border-white/10 whitespace-nowrap">
              {filteredMembers.length} members
            </div>
          </div>

          <div className="relative w-full sm:w-80 lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 pointer-events-none" />
            <Input
              placeholder="Search by name, email or Member ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 bg-zinc-900/70 border-white/10 h-12 sm:h-14 rounded-2xl text-base sm:text-lg placeholder:text-zinc-500 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Members Grid */}
        <AnimatePresence mode="wait">
          {filteredMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-3xl p-12 sm:p-16 text-center"
            >
              <Users className="w-14 h-14 sm:w-16 sm:h-16 mx-auto text-zinc-600 mb-6" />
              <p className="text-xl sm:text-2xl text-zinc-400">No members found</p>
              <p className="text-zinc-500 mt-3 text-sm sm:text-base">Add new members or adjust your search</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Card className="bg-zinc-900/80 border border-white/10 hover:border-cyan-500/60 backdrop-blur-3xl rounded-3xl overflow-hidden h-full shadow-xl transition-all duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400" />

                    <CardContent className="pt-8 pb-8 px-6 sm:px-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-7">
                        {/* Avatar */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="text-3xl sm:text-4xl font-bold text-cyan-400">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMember(member.id)}
                          className="opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 rounded-xl h-9 w-9 sm:h-10 sm:w-10 transition-all"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>

                      <h3 className="font-semibold text-xl sm:text-2xl leading-tight tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-base sm:text-lg text-zinc-400 mt-1 break-all">{member.email}</p>

                      <div className="mt-auto pt-8 space-y-3 sm:space-y-4 text-sm">
                        <div className="flex justify-between items-center bg-zinc-950/60 px-5 py-3 rounded-2xl border border-white/5">
                          <span className="text-zinc-500">Member ID</span>
                          <span className="font-mono text-white tracking-wider text-sm sm:text-base">{member.memberId}</span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-950/60 px-5 py-3 rounded-2xl border border-white/5">
                          <span className="text-zinc-500">Phone</span>
                          <span className="font-mono text-emerald-400 text-sm sm:text-base">{member.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
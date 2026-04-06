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

      <main className="relative max-w-7xl mx-auto px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl shadow-xl shadow-cyan-500/30">
              <Users className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Library Members
              </h1>
              <p className="text-xl text-zinc-400 mt-3">Manage your community with elegance</p>
            </div>
          </div>
        </motion.div>

        {/* Add Member Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <Card className="bg-zinc-900/70 border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="pb-8 border-b border-white/10">
              <CardTitle className="text-3xl font-semibold flex items-center gap-3">
                <Plus className="w-8 h-8 text-cyan-400" />
              <p className='text-white'> Add New Member </p>  
              </CardTitle>
            </CardHeader>
           <CardContent className="p-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

    {/* Name */}
    <div className="relative group">
      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-cyan-400 transition" />
      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="pl-12 h-14 rounded-2xl bg-zinc-950/60 border border-white/10 
        text-white placeholder:text-zinc-500
        focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30
        transition-all"
      />
    </div>

    {/* Email */}
    <div className="relative group">
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition" />
      <Input
        placeholder="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="pl-12 h-14 rounded-2xl bg-zinc-950/60 border border-white/10 
        text-white placeholder:text-zinc-500
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
        transition-all"
      />
    </div>

    {/* Phone */}
    <div className="relative group">
      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition" />
      <Input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="pl-12 h-14 rounded-2xl bg-zinc-950/60 border border-white/10 
        text-white placeholder:text-zinc-500
        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30
        transition-all"
      />
    </div>

    {/* Member ID */}
    <div className="relative group">
      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition" />
      <Input
        placeholder="Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="pl-12 h-14 rounded-2xl bg-zinc-950/60 border border-white/10 
        text-white placeholder:text-zinc-500 font-mono
        focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
        transition-all"
      />
    </div>

    {/* Button */}
    <Button
      onClick={addMember}
      disabled={!name || !email || !phone || !memberId}
      className="h-14 rounded-2xl text-lg font-semibold
      bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
      hover:scale-[1.03] active:scale-95 transition-all
      shadow-lg shadow-blue-500/20
      disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Plus className="w-5 h-5 mr-2" />
      Add
    </Button>

  </div>
</CardContent>
          </Card>
        </motion.div>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">All Members</h2>
            <div className="px-4 py-1 bg-white/5 text-sm rounded-full text-zinc-400 border border-white/10">
              {filteredMembers.length} members
            </div>
          </div>

          <div className="relative w-full sm:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <Input
              placeholder="Search by name, email or Member ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 bg-zinc-900/70 border-white/10 h-14 rounded-2xl text-lg placeholder:text-zinc-500 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Members Grid */}
        <AnimatePresence mode="wait">
          {filteredMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-3xl p-16 text-center"
            >
              <Users className="w-16 h-16 mx-auto text-zinc-600 mb-6" />
              <p className="text-2xl text-zinc-400">No members found</p>
              <p className="text-zinc-500 mt-3">Add new members or adjust your search</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group"
                >
                  <Card className="bg-zinc-900/80 border border-white/10 hover:border-cyan-500/60 backdrop-blur-3xl rounded-3xl overflow-hidden h-full shadow-xl transition-all duration-500 relative">
                    
                    {/* Top Gradient Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400" />

                    <CardContent className="pt-9 pb-8 px-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-8">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="text-4xl font-bold text-cyan-400">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMember(member.id)}
                          className="opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <h3 className="font-semibold text-2xl leading-tight tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-lg text-zinc-400 mt-1">{member.email}</p>

                      {/* Details */}
                      <div className="mt-auto pt-8 space-y-4 text-sm">
                        <div className="flex justify-between items-center bg-zinc-950/60 px-5 py-3 rounded-2xl border border-white/5">
                          <span className="text-zinc-500">Member ID</span>
                          <span className="font-mono text-white tracking-wider">{member.memberId}</span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-950/60 px-5 py-3 rounded-2xl border border-white/5">
                          <span className="text-zinc-500">Phone</span>
                          <span className="font-mono text-emerald-400">{member.phone}</span>
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
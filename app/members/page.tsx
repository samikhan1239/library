'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Search, Mail, Phone, Hash, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  memberId: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  // Add Member Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [memberId, setMemberId] = useState('');
  const [adding, setAdding] = useState(false);

  // List States
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members');
      if (!res.ok) throw new Error('Failed to fetch members');
      const data: Member[] = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async () => {
    if (!name || !email || !phone || !memberId) {
      toast.error('Please fill all fields');
      return;
    }

    setAdding(true);

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, memberId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to add member');
        return;
      }

      setMembers([data, ...members]);
      toast.success('Member added successfully!', {
        description: `${name} (${memberId})`,
      });

      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setMemberId('');
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Something went wrong while adding member');
    } finally {
      setAdding(false);
    }
  };

  const deleteMember = async (id: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete "${memberName}"?`)) return;

    try {
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete member');
        return;
      }

      setMembers(members.filter((m) => m._id !== id));
      toast.success(`"${memberName}" has been deleted`);
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(#4f46e510_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-blue-950/10" />

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
              <Users className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">Library Members</h1>
              <p className="text-zinc-400 mt-2 text-lg">Manage your community efficiently</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-10">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 ${
              activeTab === 'add'
                ? 'border-cyan-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-5 h-5" />
            Add New Member
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 ${
              activeTab === 'list'
                ? 'border-cyan-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-5 h-5" />
            All Members ({members.length})
          </button>
        </div>

        {/* ====================== ADD MEMBER TAB ====================== */}
        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-zinc-900/90 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl font-semibold flex items-center gap-4 text-white">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl">
                    <Plus className="w-8 h-8 text-cyan-400" />
                  </div>
                  Add New Member
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 px-10 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Full Name</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-cyan-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        type="email"
                        placeholder="member@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-blue-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-emerald-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Member ID</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="MEM-00123"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 font-mono focus:border-purple-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={addMember}
                  disabled={!name || !email || !phone || !memberId || adding}
                  className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 mt-6 disabled:opacity-50"
                >
                  {adding ? 'Adding Member...' : 'Add Member'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ====================== ALL MEMBERS TAB (Table) ====================== */}
        {activeTab === 'list' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold">All Members</h2>

              <div className="relative w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <Input
                  placeholder="Search by name, email or Member ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 h-12 bg-zinc-900/80 border-white/10 rounded-2xl text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            <Card className="bg-zinc-900/90 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-zinc-400 font-medium">Name</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Email</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Phone</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Member ID</TableHead>
                    <TableHead className="text-right text-zinc-400 w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
                          <p className="text-zinc-400">Loading members...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-zinc-400">
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow
                        key={member._id}
                        className="border-white/10 hover:bg-zinc-800/70 transition-colors group"
                      >
                        <TableCell className="font-medium text-white">{member.name}</TableCell>
                        <TableCell className="text-zinc-300">{member.email}</TableCell>
                        <TableCell className="font-mono text-emerald-400">{member.phone}</TableCell>
                        <TableCell>
                          <span className="font-mono text-purple-400 tracking-wider">{member.memberId}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMember(member._id, member.name)}
                            className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {filteredMembers.length > 0 && (
              <p className="text-center text-zinc-500 mt-6 text-sm">
                Showing {filteredMembers.length} of {members.length} members
              </p>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
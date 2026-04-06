'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Users } from 'lucide-react';
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

  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(savedMembers);
  }, []);

  const addMember = () => {
    if (!name || !email || !phone || !memberId) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      memberId,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter">
                Members
              </h1>
              <p className="text-zinc-400 mt-2 text-lg">
                Manage your library members
              </p>
            </div>
          </div>
        </motion.div>

        {/* ADD MEMBER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-zinc-900/80 border-white/10 backdrop-blur-2xl rounded-3xl mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Add New Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />

                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />

                <Input
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />

                <Input
                  placeholder="Member ID"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />

                <Button
                  onClick={addMember}
                  className="h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white font-semibold rounded-2xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* MEMBERS LIST */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-semibold">
            All Members ({members.length})
          </h2>
        </div>

        <AnimatePresence>
          {members.length === 0 ? (
            <Card className="bg-zinc-900/50 border-white/10 rounded-3xl p-12 text-center">
              <p className="text-zinc-400 text-lg">
                No members added yet.
              </p>
              <p className="text-zinc-500 mt-2">
                Add your first member above.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-zinc-900/80 border-white/10 hover:border-blue-500/50 backdrop-blur-2xl rounded-3xl h-full">
                    <CardContent className="pt-6 pb-6 flex flex-col justify-between h-full">

                      <div>
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                          <span className="text-lg font-bold text-blue-400">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <h3 className="font-bold text-xl">
                          {member.name}
                        </h3>
                        <p className="text-zinc-400 text-sm">
                          {member.email}
                        </p>

                        <div className="mt-5 space-y-2 text-sm bg-zinc-950/50 p-4 rounded-2xl">
                          <p>
                            <span className="text-zinc-500">Member ID:</span>{" "}
                            {member.memberId}
                          </p>
                          <p>
                            <span className="text-zinc-500">Phone:</span>{" "}
                            {member.phone}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => deleteMember(member.id)}
                        className="mt-5 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>

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
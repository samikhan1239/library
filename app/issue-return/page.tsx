'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, RotateCcw, BookOpen, Users, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Issue {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  issueDate: string;
  returnDate: string | null;
}

interface Book {
  id: string;
  title: string;
}

interface Member {
  id: string;
  name: string;
}

export default function IssueReturnPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    const savedMembers = JSON.parse(localStorage.getItem('members') || '[]');
    const savedIssues = JSON.parse(localStorage.getItem('issues') || '[]');

    setBooks(savedBooks);
    setMembers(savedMembers);
    setIssues(savedIssues);
  }, []);

  const issueBook = () => {
    if (!selectedBook || !selectedMember) return;

    const book = books.find(b => b.id === selectedBook);
    const member = members.find(m => m.id === selectedMember);

    if (!book || !member) return;

    const newIssue: Issue = {
      id: Date.now().toString(),
      bookId: selectedBook,
      bookTitle: book.title,
      memberId: selectedMember,
      memberName: member.name,
      issueDate: new Date().toLocaleDateString(),
      returnDate: null,
    };

    const updatedIssues = [...issues, newIssue];
    setIssues(updatedIssues);
    localStorage.setItem('issues', JSON.stringify(updatedIssues));

    setSelectedBook('');
    setSelectedMember('');
  };

  const returnBook = (id: string) => {
    const updatedIssues = issues.map(issue =>
      issue.id === id
        ? { ...issue, returnDate: new Date().toLocaleDateString() }
        : issue
    );
    setIssues(updatedIssues);
    localStorage.setItem('issues', JSON.stringify(updatedIssues));
  };

  const activeIssues = issues.filter(issue => !issue.returnDate);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(#4f46e510_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-fuchsia-950/20" />

      <main className="relative max-w-7xl mx-auto px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl shadow-xl shadow-violet-500/30">
              <RotateCcw className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Issue &amp; Return
              </h1>
              <p className="text-xl text-zinc-400 mt-3">Seamlessly manage book transactions</p>
            </div>
          </div>
        </motion.div>

        {/* Issue Book Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <Card className="bg-zinc-900/70 border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="pb-8 border-b border-white/10">
              <CardTitle className="text-3xl font-semibold flex items-center gap-3">
                <RotateCcw className="w-8 h-8 text-violet-400" />
               <p className ="text-white">   Issue New Book</p> 
              </CardTitle>
            </CardHeader>
          <CardContent className="p-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

    {/* Member Select */}
   <div className="relative group flex items-center">
  <Users className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition pointer-events-none" />
  
  <Select value={selectedMember} onValueChange={setSelectedMember}>
    <SelectTrigger
      className="pl-12 h-14 flex items-center rounded-2xl 
      bg-zinc-950/60 border border-white/10 
      text-white text-lg 
      focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 
      transition-all"
    >
      <SelectValue placeholder="Select Member" />
    </SelectTrigger>

    <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
      {members.map(member => (
        <SelectItem key={member.id} value={member.id}>
          {member.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

    {/* Book Select */}
    <div className="relative group flex items-center">
  <BookOpen className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-fuchsia-400 transition pointer-events-none" />
  
  <Select value={selectedBook} onValueChange={setSelectedBook}>
    <SelectTrigger
      className="pl-12 h-14 flex items-center rounded-2xl 
      bg-zinc-950/60 border border-white/10 
      text-white text-lg 
      focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 
      transition-all"
    >
      <SelectValue placeholder="Select Book" />
    </SelectTrigger>

    <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
      {books.map(book => (
        <SelectItem key={book.id} value={book.id}>
          {book.title}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

    {/* Button */}
    <Button
      onClick={issueBook}
      disabled={!selectedBook || !selectedMember}
      className="h-14 rounded-2xl text-lg font-semibold
      bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500
      hover:scale-[1.03] active:scale-95 transition-all
      shadow-lg shadow-violet-500/20
      disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <RotateCcw className="w-5 h-5 mr-2" />
      Issue Book
    </Button>

  </div>
</CardContent>
          </Card>
        </motion.div>

        {/* Active Issues Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">Active Issues</h2>
            <div className="px-4 py-1 bg-white/5 text-sm rounded-full text-zinc-400 border border-white/10">
              {activeIssues.length} books out
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeIssues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-3xl p-16 text-center"
            >
              <RotateCcw className="w-16 h-16 mx-auto text-zinc-600 mb-6" />
              <p className="text-2xl text-zinc-400">No active issues</p>
              <p className="text-zinc-500 mt-3">Issue a book to get started</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group"
                >
                  <Card className="bg-zinc-900/80 border border-white/10 hover:border-violet-500/60 backdrop-blur-3xl rounded-3xl overflow-hidden h-full shadow-xl transition-all duration-500 relative">
                    
                    {/* Top Gradient Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />

                    <CardContent className="pt-9 pb-8 px-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-white/10">
                          <BookOpen className="w-9 h-9 text-violet-400" />
                        </div>

                        <div className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-mono tracking-widest">
                          ACTIVE
                        </div>
                      </div>

                      <h3 className="font-semibold text-2xl leading-tight tracking-tight text-white group-hover:text-violet-200 transition-colors">
                        {issue.bookTitle}
                      </h3>
                      <p className="text-lg text-zinc-400 mt-2">Issued to {issue.memberName}</p>

                      {/* Issue Details */}
                      <div className="mt-auto pt-8 space-y-4 text-sm">
                        <div className="flex items-center gap-3 bg-zinc-950/60 px-5 py-3 rounded-2xl border border-white/5">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <div>
                            <span className="text-zinc-500">Issued on</span>
                            <p className="font-medium text-white">{issue.issueDate}</p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => returnBook(issue.id)}
                        className="mt-8 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-semibold rounded-2xl h-12 text-base shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-3" />
                        Mark as Returned
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
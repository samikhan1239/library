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
import { CheckCircle2, RotateCcw } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Issue / Return
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Manage book issuance and returns
          </p>
        </motion.div>

        {/* ISSUE FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-zinc-900/80 border-white/10 backdrop-blur-2xl rounded-3xl mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Issue Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger className="bg-zinc-800 border-white/10 text-white h-12 rounded-2xl">
                    <SelectValue placeholder="Select Member" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-white border-white/10">
                    {members.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger className="bg-zinc-800 border-white/10 text-white h-12 rounded-2xl">
                    <SelectValue placeholder="Select Book" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-white border-white/10">
                    {books.map(book => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={issueBook}
                  className="h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 text-white font-semibold rounded-2xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Issue Book
                </Button>

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ACTIVE ISSUES */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-semibold">
            Active Issues ({activeIssues.length})
          </h2>
        </div>

        <AnimatePresence>
          {activeIssues.length === 0 ? (
            <Card className="bg-zinc-900/50 border-white/10 rounded-3xl p-12 text-center">
              <p className="text-zinc-400 text-lg">
                No active issues yet.
              </p>
              <p className="text-zinc-500 mt-2">
                Issue your first book above.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-zinc-900/80 border-white/10 hover:border-violet-500/50 backdrop-blur-2xl rounded-3xl h-full">
                    <CardContent className="pt-6 pb-6 flex flex-col justify-between h-full">

                      <div>
                        <h3 className="font-bold text-xl mb-1">
                          {issue.bookTitle}
                        </h3>
                        <p className="text-zinc-400">
                          {issue.memberName}
                        </p>

                        <div className="mt-4 text-sm bg-zinc-950/50 p-4 rounded-xl">
                          <p>
                            <span className="text-zinc-500">Issued:</span>{" "}
                            {issue.issueDate}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => returnBook(issue.id)}
                        className="mt-5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
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
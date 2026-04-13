'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Users, RotateCcw, CheckCircle2, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Issue {
  _id: string;
  bookName: string;
  author: string;
  rfid: string;
  studentName: string;
  enrollmentNumber: string;
  branch: string;
  year: string;
  issueDate: string;
  returnDate: string | null;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  rfid: string;
}

interface Member {
  _id: string;
  name: string;
  memberId: string;
}

const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EEE', 'Chemical', 'Biotech', 'Other'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];

export default function IssueReturnPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<'issue' | 'active' | 'returned' | 'all'>('issue');

  // Form States
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [rfid, setRfid] = useState('');
  const [studentName, setStudentName] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');

  const [selectedQuickBook, setSelectedQuickBook] = useState('');
  const [selectedQuickMember, setSelectedQuickMember] = useState('');

  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [booksRes, membersRes, issuesRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/members'),
          fetch('/api/issues'),
        ]);

        setBooks(await booksRes.json());
        setMembers(await membersRes.json());
        setIssues(await issuesRes.json());
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleQuickBookSelect = (bookId: string) => {
    setSelectedQuickBook(bookId);
    const book = books.find(b => b._id === bookId);
    if (book) {
      setBookName(book.title);
      setAuthor(book.author);
      setRfid(book.rfid);
    }
  };

  const handleQuickMemberSelect = (memberId: string) => {
    setSelectedQuickMember(memberId);
    const member = members.find(m => m._id === memberId);
    if (member) {
      setStudentName(member.name);
      setEnrollmentNumber(member.memberId);
    }
  };

  const issueBook = async () => {
    if (!bookName || !author || !rfid || !studentName || !enrollmentNumber || !branch || !year) {
      toast.error('Please fill all required fields');
      return;
    }

    setIssuing(true);

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookName: bookName.trim(),
          author: author.trim(),
          rfid: rfid.trim(),
          studentName: studentName.trim(),
          enrollmentNumber: enrollmentNumber.trim(),
          branch: branch.trim(),
          year: year.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to issue book');
      }

      const newIssue = await response.json();
      setIssues(prev => [newIssue, ...prev]);

      resetForm();

      toast.success('Book issued successfully!', {
        description: `${bookName} → ${studentName}`,
        duration: 4000,
      });
    } catch (err: any) {
      toast.error(err.message || 'Error issuing book');
    } finally {
      setIssuing(false);
    }
  };

  const returnBook = async (id: string, bookName: string) => {
    try {
      const res = await fetch(`/api/issues?id=${id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to return book');

      setIssues(prev =>
        prev.map(issue =>
          issue._id === id ? { ...issue, returnDate: new Date().toISOString() } : issue
        )
      );

      toast.success(`"${bookName}" marked as returned`, { duration: 3000 });
    } catch (err) {
      toast.error('Error returning book');
    }
  };

  const resetForm = () => {
    setBookName(''); setAuthor(''); setRfid('');
    setStudentName(''); setEnrollmentNumber('');
    setBranch(''); setYear('');
    setSelectedQuickBook(''); setSelectedQuickMember('');
  };

  const activeIssues = issues.filter(i => !i.returnDate);
  const returnedIssues = issues.filter(i => i.returnDate);

  const booksWithStatus = books.map(book => {
    const currentIssue = issues.find(issue => issue.rfid === book.rfid && !issue.returnDate);
    return {
      ...book,
      isIssued: !!currentIssue,
      currentBorrower: currentIssue?.studentName || null,
      issueId: currentIssue?._id || null,
    };
  });

  const filteredBooks = booksWithStatus.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.currentBorrower && book.currentBorrower.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredActive = activeIssues.filter(issue =>
    issue.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReturned = returnedIssues.filter(issue =>
    issue.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-violet-400 text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="fixed inset-0 bg-[radial-gradient(#4f46e510_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-fuchsia-950/10" />

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl">
              <RotateCcw className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter text-white">Issue & Return</h1>
              <p className="text-zinc-400 mt-2 text-lg">Manage book transactions</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-10 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 whitespace-nowrap ${
              activeTab === 'issue' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowRight className="w-5 h-5" /> Issue Book
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 whitespace-nowrap ${
              activeTab === 'active' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" /> Issued Books ({activeIssues.length})
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 whitespace-nowrap ${
              activeTab === 'returned' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" /> Returned Books ({returnedIssues.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 whitespace-nowrap ${
              activeTab === 'all' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" /> All Books ({books.length})
          </button>
        </div>

        {/* ====================== ISSUE BOOK TAB ====================== */}
        {activeTab === 'issue' && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-zinc-900/95 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl font-semibold flex items-center gap-4 text-white">
                  <RotateCcw className="w-8 h-8 text-violet-400" />
                  Issue New Book
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 space-y-10">
                {/* Quick Select */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-300">Quick Book Select</label>
                    <Select value={selectedQuickBook} onValueChange={handleQuickBookSelect}>
                      <SelectTrigger className="h-14 rounded-2xl bg-zinc-950 border-white/20 text-white focus:border-violet-500">
                        <SelectValue placeholder="Select from registered books" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {books.map(book => (
                          <SelectItem key={book._id} value={book._id} className="text-white">
                            {book.title} — {book.author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-300">Quick Member Select</label>
                    <Select value={selectedQuickMember} onValueChange={handleQuickMemberSelect}>
                      <SelectTrigger className="h-14 rounded-2xl bg-zinc-950 border-white/20 text-white focus:border-violet-500">
                        <SelectValue placeholder="Select from registered members" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {members.map(member => (
                          <SelectItem key={member._id} value={member._id} className="text-white">
                            {member.name} ({member.memberId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Manual Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Book Name', value: bookName, setter: setBookName, placeholder: 'Book title' },
                    { label: 'Author', value: author, setter: setAuthor, placeholder: 'Author name' },
                    { label: 'RFID Tag', value: rfid, setter: setRfid, placeholder: 'RFID code', mono: true },
                    { label: 'Student Name', value: studentName, setter: setStudentName, placeholder: 'Full name' },
                    { label: 'Enrollment Number', value: enrollmentNumber, setter: setEnrollmentNumber, placeholder: 'ENR-XXXXXX', mono: true },
                  ].map((field, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-sm text-zinc-300">{field.label}</label>
                      <Input
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        placeholder={field.placeholder}
                        className={`h-14 rounded-2xl bg-zinc-950 border-white/20 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 ${field.mono ? 'font-mono' : ''}`}
                      />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300">Branch</label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="h-14 rounded-2xl bg-zinc-950 border-white/20 text-white focus:border-emerald-500">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300">Year</label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="h-14 rounded-2xl bg-zinc-950 border-white/20 text-white focus:border-emerald-500">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={issueBook}
                  disabled={issuing || !bookName || !author || !rfid || !studentName || !enrollmentNumber || !branch || !year}
                  className="w-full h-16 text-xl font-semibold rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 hover:brightness-110 mt-4 disabled:opacity-50"
                >
                  {issuing ? 'Issuing...' : 'Issue Book'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ====================== TABLE TABS ====================== */}
        {(activeTab === 'active' || activeTab === 'returned' || activeTab === 'all') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-white">
                {activeTab === 'active' && 'Currently Issued Books'}
                {activeTab === 'returned' && 'Returned Books'}
                {activeTab === 'all' && 'All Books Inventory'}
              </h2>

              <div className="relative w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <Input
                  placeholder="Search by book, author or student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 h-12 bg-zinc-900 border-white/20 text-white placeholder:text-zinc-500 focus:border-violet-500"
                />
              </div>
            </div>

            <Card className="bg-zinc-900/95 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-zinc-300 font-medium">Book Title</TableHead>
                    <TableHead className="text-zinc-300 font-medium">Author</TableHead>
                    <TableHead className="text-zinc-300 font-medium">RFID</TableHead>
                    {activeTab !== 'all' && <TableHead className="text-zinc-300 font-medium">Student</TableHead>}
                    {activeTab !== 'all' && <TableHead className="text-zinc-300 font-medium">Enrollment</TableHead>}
                    {activeTab === 'all' && <TableHead className="text-zinc-300 font-medium">Status</TableHead>}
                    {activeTab === 'all' && <TableHead className="text-zinc-300 font-medium">Borrower</TableHead>}
                    <TableHead className="text-right text-zinc-300 font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(activeTab === 'active' && filteredActive.length === 0) ||
                   (activeTab === 'returned' && filteredReturned.length === 0) ||
                   (activeTab === 'all' && filteredBooks.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={activeTab === 'all' ? 6 : 5} className="text-center py-16 text-zinc-400">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {activeTab === 'active' && filteredActive.map(issue => (
                        <TableRow key={issue._id} className="border-white/10 hover:bg-zinc-800/60">
                          <TableCell className="font-medium text-white">{issue.bookName}</TableCell>
                          <TableCell className="text-zinc-200">{issue.author}</TableCell>
                          <TableCell><span className="font-mono text-zinc-400">{issue.rfid}</span></TableCell>
                          <TableCell className="text-white">{issue.studentName}</TableCell>
                          <TableCell className="font-mono text-zinc-300">{issue.enrollmentNumber}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => returnBook(issue._id, issue.bookName)}
                              variant="ghost"
                              className="text-emerald-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Return
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {activeTab === 'returned' && filteredReturned.map(issue => (
                        <TableRow key={issue._id} className="border-white/10 hover:bg-zinc-800/60">
                          <TableCell className="font-medium text-white">{issue.bookName}</TableCell>
                          <TableCell className="text-zinc-200">{issue.author}</TableCell>
                          <TableCell><span className="font-mono text-zinc-400">{issue.rfid}</span></TableCell>
                          <TableCell className="text-white">{issue.studentName}</TableCell>
                          <TableCell className="font-mono text-zinc-300">{issue.enrollmentNumber}</TableCell>
                          <TableCell className="text-right text-emerald-400">Returned</TableCell>
                        </TableRow>
                      ))}

                      {activeTab === 'all' && filteredBooks.map(book => (
                        <TableRow key={book._id} className="border-white/10 hover:bg-zinc-800/60">
                          <TableCell className="font-medium text-white">{book.title}</TableCell>
                          <TableCell className="text-zinc-200">{book.author}</TableCell>
                          <TableCell><span className="font-mono text-zinc-400">{book.rfid}</span></TableCell>
                          <TableCell>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              book.isIssued 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {book.isIssued ? 'Issued' : 'Available'}
                            </span>
                          </TableCell>
                          <TableCell className="text-zinc-200">
                            {book.currentBorrower || <span className="text-zinc-500">—</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            {book.isIssued && book.issueId && (
                              <Button
                                onClick={() => returnBook(book.issueId!, book.title)}
                                variant="ghost"
                                size="sm"
                                className="text-emerald-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                              >
                                Return
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
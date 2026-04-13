'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Plus, Search, Hash, User, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  rfid: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  // Add Book Form States
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [rfid, setRfid] = useState('');
  const [adding, setAdding] = useState(false);

  // List States
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      const data: Book[] = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async () => {
    if (!title || !author || !isbn || !rfid) {
      toast.error('Please fill all fields');
      return;
    }

    setAdding(true);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, isbn, rfid }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to add book');
        return;
      }

      setBooks([data, ...books]);
      toast.success('Book added successfully!', {
        description: `${title} by ${author}`,
      });

      setTitle(''); setAuthor(''); setIsbn(''); setRfid('');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Something went wrong while adding the book');
    } finally {
      setAdding(false);
    }
  };

  const deleteBook = async (id: string, bookTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;

    try {
      const res = await fetch(`/api/books?id=${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete book');
        return;
      }

      setBooks(books.filter((b) => b._id !== id));
      toast.success(`"${bookTitle}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm) ||
    book.rfid.includes(searchTerm)
  );

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
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">Library Management</h1>
              <p className="text-zinc-400 mt-2 text-lg">Manage your book inventory efficiently</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-10">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 ${
              activeTab === 'add' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-5 h-5" />
            Add New Book
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-8 py-4 font-medium text-lg transition-all flex items-center gap-3 border-b-2 ${
              activeTab === 'list' ? 'border-violet-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            All Books ({books.length})
          </button>
        </div>

        {/* Add Book Tab */}
        {activeTab === 'add' && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <Card className="bg-zinc-900/90 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl font-semibold flex items-center gap-4 text-white">
                  <div className="p-3 bg-violet-500/10 rounded-2xl">
                    <Plus className="w-8 h-8 text-violet-400" />
                  </div>
                  Add New Book to Collection
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 px-10 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Book Title</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="Enter book title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-violet-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Author Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="Enter author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-violet-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">ISBN / Unique ID</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="978-3-16-148410-0"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 font-mono focus:border-fuchsia-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">RFID Tag Code</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                      <Input
                        placeholder="RFID-892347"
                        value={rfid}
                        onChange={(e) => setRfid(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-zinc-950 border-white/10 font-mono focus:border-cyan-500 text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={addBook}
                  disabled={!title || !author || !isbn || !rfid || adding}
                  className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 mt-6 disabled:opacity-50"
                >
                  {adding ? 'Adding Book...' : 'Add Book to Library'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* All Books Tab - Table with Visible Delete Button */}
        {activeTab === 'list' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold">All Books</h2>

              <div className="relative w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <Input
                  placeholder="Search by title, author, ISBN or RFID..."
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
                    <TableHead className="text-zinc-400 font-medium">Title</TableHead>
                    <TableHead className="text-zinc-400 font-medium">Author</TableHead>
                    <TableHead className="text-zinc-400 font-medium">ISBN</TableHead>
                    <TableHead className=" font-medium text-zinc-400">RFID Tag</TableHead>
                    <TableHead className="text-right text-zinc-400 w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
                          <p className="text-zinc-400">Loading books...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-zinc-400">
                        No books found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBooks.map((book) => (
                      <TableRow 
                        key={book._id} 
                        className="border-white/10 hover:bg-zinc-800/70 transition-colors group"
                      >
                        <TableCell className="font-medium text-white">{book.title}</TableCell>
                        <TableCell className="text-zinc-300">{book.author}</TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-zinc-400">{book.isbn}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-emerald-400 tracking-widest text-sm">
                            {book.rfid}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Delete Button - Now clearly visible */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteBook(book._id, book.title)}
                              className="h-9 w-9 text-red-400 hover:text-red-500 hover:bg-red-500/10 
                                         opacity-80 hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {filteredBooks.length > 0 && (
              <p className="text-center text-zinc-500 mt-6 text-sm">
                Showing {filteredBooks.length} of {books.length} books
              </p>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, BookOpen, Search, Hash, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  rfid: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [rfid, setRfid] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(savedBooks);
  }, []);

  const addBook = () => {
    if (!title || !author || !isbn || !rfid) return;

    const newBook: Book = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      rfid: rfid.trim(),
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));

    setTitle(''); 
    setAuthor(''); 
    setIsbn(''); 
    setRfid('');
  };

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

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
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Books Collection
              </h1>
              <p className="text-xl text-zinc-400 mt-3">Manage your entire library inventory with elegance</p>
            </div>
          </div>
        </motion.div>

        {/* Add Book Form - Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <Card className="bg-zinc-900/70 border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="pb-8 border-b border-white/10">
              <CardTitle className="text-3xl font-semibold flex items-center gap-3">
                <Plus className="w-8 h-8 text-violet-400" />
                <p className='text-white'> Add New Book</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="relative">
                  <BookOpen className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                  <Input
                    placeholder="Book Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="pl-12 bg-zinc-950/70 border-white/10 h-14 rounded-2xl text-lg placeholder:text-zinc-500 focus:border-violet-500"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                  <Input
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="pl-12 bg-zinc-950/70 border-white/10 h-14 rounded-2xl text-lg placeholder:text-zinc-500 focus:border-violet-500"
                  />
                </div>

                <div className="relative">
                  <Hash className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                  <Input
                    placeholder="ISBN Number"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="pl-12 bg-zinc-950/70 border-white/10 h-14 rounded-2xl text-lg placeholder:text-zinc-500 focus:border-violet-500 font-mono"
                  />
                </div>

                <div className="relative">
                  <Button 
                    onClick={addBook} 
                    disabled={!title || !author || !isbn || !rfid}
                    className="w-full h-14 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 hover:brightness-110 text-white font-semibold rounded-2xl text-lg shadow-lg shadow-violet-500/30 transition-all active:scale-95"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Add to Collection
                  </Button>
                </div>
              </div>

              {/* RFID Field - Full width on smaller screens */}
              <div className="mt-5">
                <div className="relative">
                  <Input
                    placeholder="RFID Tag Code"
                    value={rfid}
                    onChange={(e) => setRfid(e.target.value)}
                    className="pl-6 bg-zinc-950/70 border-white/10 h-14 rounded-2xl text-lg placeholder:text-zinc-500 focus:border-violet-500 font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">All Books</h2>
            <div className="px-4 py-1 bg-white/5 text-sm rounded-full text-zinc-400 border border-white/10">
              {filteredBooks.length} titles
            </div>
          </div>

          <div className="relative w-full sm:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <Input
              placeholder="Search by title, author or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 bg-zinc-900/70 border-white/10 h-14 rounded-2xl text-lg placeholder:text-zinc-500 focus:border-fuchsia-500"
            />
          </div>
        </div>

        {/* Books Grid */}
        <AnimatePresence mode="wait">
          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-3xl p-16 text-center"
            >
              <BookOpen className="w-16 h-16 mx-auto text-zinc-600 mb-6" />
              <p className="text-2xl text-zinc-400">No books found</p>
              <p className="text-zinc-500 mt-3">Try adjusting your search or add a new book</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
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

                    <CardContent className="pt-9 pb-8 px-8">
                      <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-white/10 group-hover:border-violet-500/30 transition-colors">
                          <BookOpen className="w-9 h-9 text-violet-400" />
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBook(book.id)}
                          className="opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <h3 className="font-semibold text-2xl leading-tight tracking-tight text-white line-clamp-2 group-hover:text-violet-200 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-lg text-zinc-400 mt-2">by {book.author}</p>

                      {/* Metadata */}
                      <div className="mt-8 space-y-4 text-sm">
                        <div className="flex justify-between items-center bg-zinc-950/60 px-5 py-3 rounded-2xl border border-white/5">
                          <span className="text-zinc-500">ISBN</span>
                          <span className="font-mono text-white tracking-wider">{book.isbn}</span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-950/60 px-5 py-3 rounded-2xl border border-white/5">
                          <span className="text-zinc-500">RFID Tag</span>
                          <span className="font-mono text-emerald-400 tracking-widest">{book.rfid}</span>
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
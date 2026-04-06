'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, BookOpen } from 'lucide-react';
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

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(savedBooks);
  }, []);

  const addBook = () => {
    if (!title || !author || !isbn || !rfid) return;

    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      isbn,
      rfid,
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));

    setTitle(''); setAuthor(''); setIsbn(''); setRfid('');
  };

  const deleteBook = (id: string) => {
    const updatedBooks = books.filter(b => b.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-10 h-10 text-violet-400" />
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter">Books Collection</h1>
              <p className="text-zinc-400 mt-2 text-lg">Manage your entire library inventory</p>
            </div>
          </div>
        </motion.div>

        {/* Add Book Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-zinc-900/80 border-white/10 backdrop-blur-2xl rounded-3xl mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Add New Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Input
                  placeholder="Book Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />
                <Input
                  placeholder="Author Name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />
                <Input
                  placeholder="ISBN Number"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />
                <Input
                  placeholder="RFID Tag"
                  value={rfid}
                  onChange={(e) => setRfid(e.target.value)}
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-2xl"
                />
                <Button 
                  onClick={addBook} 
                  className="h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 text-white font-semibold rounded-2xl transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Book
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Books Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-semibold">All Books ({books.length})</h2>
        </div>

        <AnimatePresence>
          {books.length === 0 ? (
            <Card className="bg-zinc-900/50 border-white/10 rounded-3xl p-12 text-center">
              <p className="text-zinc-400 text-lg">No books in the collection yet.</p>
              <p className="text-zinc-500 mt-2">Add your first book above.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-zinc-900/80 border-white/10 hover:border-violet-500/50 backdrop-blur-2xl rounded-3xl overflow-hidden h-full">
                    <CardContent className="pt-8 pb-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-violet-500/10 rounded-2xl">
                          <BookOpen className="w-8 h-8 text-violet-400" />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBook(book.id)}
                          className="rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <h3 className="font-bold text-xl leading-tight line-clamp-2 mb-2 text-white">{book.title}</h3>
                      <p className="text-zinc-400">by {book.author}</p>

                      <div className="mt-6 space-y-3 text-sm bg-zinc-950/50 p-5 rounded-2xl">
                        <div><span className="text-zinc-500">ISBN:</span> <span className="text-white font-mono">{book.isbn}</span></div>
                        <div><span className="text-zinc-500">RFID:</span> <span className="text-white font-mono">{book.rfid}</span></div>
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
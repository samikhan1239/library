'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Alert {
  _id: string;
  rfidTag: string;
  bookTitle: string;
  bookAuthor?: string;
  timestamp: string;
  status: 'active' | 'resolved';
  issueStatus: 'Issued' | 'Not Issued';   // ← Added
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error('Failed to fetch alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const resolveAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts?id=${id}`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to resolve alert');
      
      toast.success('Alert resolved successfully');
      fetchAlerts();
    } catch (err) {
      toast.error('Failed to resolve alert');
    }
  };

  const deleteAlert = async (id: string) => {
    if (!confirm('Delete this resolved alert permanently?')) return;

    try {
      const res = await fetch(`/api/alerts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete alert');
      
      toast.success('Alert deleted permanently');
      fetchAlerts();
    } catch (err) {
      toast.error('Failed to delete alert');
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-rose-400 text-2xl">
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="fixed inset-0 bg-[radial-gradient(#4f46e510_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-rose-950/30 via-transparent to-amber-950/20" />

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-rose-500 to-amber-500 rounded-2xl">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter text-white">Alerts Monitor</h1>
              <p className="text-zinc-400 mt-2 text-lg">Real-time notifications and unauthorized scans</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-zinc-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-1.5 mb-10">
            <TabsTrigger 
              value="active" 
              className="rounded-2xl px-8 py-3 text-base data-[state=active]:bg-rose-600 data-[state=active]:text-white"
            >
              Active Alerts ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="resolved" 
              className="rounded-2xl px-8 py-3 text-base data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              Resolved ({resolvedAlerts.length})
            </TabsTrigger>
          </TabsList>

          {/* ====================== ACTIVE ALERTS TAB ====================== */}
          <TabsContent value="active" className="mt-0">
            <Card className="bg-zinc-900/95 border border-rose-500/20 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-zinc-300">Book Title</TableHead>
                      <TableHead className="text-zinc-300">Author</TableHead>
                      <TableHead className="text-zinc-300">RFID Tag</TableHead>
                      <TableHead className="text-zinc-300">Issue Status</TableHead>
                      <TableHead className="text-zinc-300">Detected On</TableHead>
                      <TableHead className="text-right text-zinc-300">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeAlerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-zinc-400">
                          No active alerts. Everything is clear! ✅
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeAlerts.map((alert) => (
                        <TableRow 
                          key={alert._id} 
                          className="border-white/10 hover:bg-rose-950/30 bg-rose-950/10"
                        >
                          <TableCell className="font-medium text-white">{alert.bookTitle}</TableCell>
                          <TableCell className="text-zinc-200">
                            {alert.bookAuthor || <span className="text-zinc-500">—</span>}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-rose-400 font-medium">{alert.rfidTag}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 font-medium text-rose-500">
                              <XCircle className="w-5 h-5" />
                              {alert.issueStatus}
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-300">
                            {new Date(alert.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => resolveAlert(alert._id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Resolve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================== RESOLVED ALERTS TAB ====================== */}
          <TabsContent value="resolved" className="mt-0">
            <Card className="bg-zinc-900/95 border border-emerald-500/20 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  Resolved Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-zinc-300">Book Title</TableHead>
                      <TableHead className="text-zinc-300">Author</TableHead>
                      <TableHead className="text-zinc-300">RFID Tag</TableHead>
                      <TableHead className="text-zinc-300">Issue Status</TableHead>
                      <TableHead className="text-zinc-300">Resolved On</TableHead>
                      <TableHead className="text-right text-zinc-300">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedAlerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-zinc-400">
                          No resolved alerts yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      resolvedAlerts.map((alert) => (
                        <TableRow 
                          key={alert._id} 
                          className="border-white/10 hover:bg-emerald-950/30 bg-emerald-950/10"
                        >
                          <TableCell className="font-medium text-white line-through opacity-90">
                            {alert.bookTitle}
                          </TableCell>
                          <TableCell className="text-zinc-400">
                            {alert.bookAuthor || <span className="text-zinc-500">—</span>}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-zinc-500">{alert.rfidTag}</span>
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-2 font-medium ${
                              alert.issueStatus === 'Not Issued' ? 'text-rose-500' : 'text-emerald-500'
                            }`}>
                              {alert.issueStatus === 'Not Issued' ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                              {alert.issueStatus}
                            </div>
                          </TableCell>
                          <TableCell className="text-emerald-400 font-medium">
                            {new Date(alert.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => deleteAlert(alert._id)}
                              variant="ghost"
                              className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
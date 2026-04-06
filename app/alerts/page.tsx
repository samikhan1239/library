'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  rfidTag: string;
  bookTitle: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    setAlerts(savedAlerts);
  }, []);

  const resolveAlert = (id: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, status: 'resolved' } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
  };

  const deleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter(a => a.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(#4f46e510_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="fixed inset-0 bg-gradient-to-br from-rose-950/30 via-transparent to-amber-950/20" />

      <main className="relative max-w-7xl mx-auto px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-5 mb-6">
            <div className="p-4 bg-gradient-to-br from-rose-500 to-amber-500 rounded-3xl shadow-xl shadow-rose-500/30">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                Alerts Monitor
              </h1>
              <p className="text-xl text-zinc-400 mt-3">Real-time system notifications &amp; overdues</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-zinc-900/70 border border-white/10 backdrop-blur-3xl rounded-3xl p-2 mb-12">
            <TabsTrigger
              value="active"
              className="rounded-2xl px-8 py-3 text-base data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              Active Alerts ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="rounded-2xl px-8 py-3 text-base data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              Resolved ({resolvedAlerts.length})
            </TabsTrigger>
          </TabsList>

          {/* ACTIVE ALERTS */}
          <TabsContent value="active" className="mt-0">
            <AnimatePresence mode="wait">
              {activeAlerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-900/50 border border-white/10 rounded-3xl p-20 text-center"
                >
                  <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-medium text-zinc-300">All clear!</p>
                  <p className="text-zinc-500 mt-4 max-w-md mx-auto">
                    No active alerts. Your library system is running smoothly.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 60, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 40, scale: 0.95 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -12, scale: 1.03 }}
                      className="group"
                    >
                      <Card className="bg-zinc-900/80 border border-white/10 hover:border-rose-500/60 backdrop-blur-3xl rounded-3xl overflow-hidden h-full shadow-2xl relative">
                        
                        {/* Top Urgent Gradient Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />

                        <CardContent className="pt-9 pb-8 px-8 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
                              <span className="uppercase text-xs tracking-[2px] font-mono text-rose-400">URGENT</span>
                            </div>
                            <Clock className="w-5 h-5 text-zinc-500" />
                          </div>

                          <h3 className="font-semibold text-2xl leading-tight tracking-tight text-white group-hover:text-rose-200 transition-colors">
                            {alert.bookTitle}
                          </h3>

                          <div className="mt-8 space-y-4 text-sm">
                            <div className="bg-zinc-950/60 px-5 py-3.5 rounded-2xl border border-white/5 flex justify-between">
                              <span className="text-zinc-500">RFID Tag</span>
                              <span className="font-mono text-rose-300">{alert.rfidTag}</span>
                            </div>
                            <div className="bg-zinc-950/60 px-5 py-3.5 rounded-2xl border border-white/5 flex justify-between">
                              <span className="text-zinc-500">Detected</span>
                              <span className="text-white">{alert.timestamp}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => resolveAlert(alert.id)}
                            className="mt-auto w-full h-12 bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white font-semibold rounded-2xl shadow-lg shadow-amber-500/30 transition-all active:scale-95"
                          >
                            <CheckCircle className="w-5 h-5 mr-3" />
                            Resolve Alert
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* RESOLVED ALERTS */}
          <TabsContent value="resolved" className="mt-0">
            <AnimatePresence mode="wait">
              {resolvedAlerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-900/50 border border-white/10 rounded-3xl p-20 text-center"
                >
                  <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 mb-6" />
                  <p className="text-2xl text-zinc-400">No resolved alerts yet</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resolvedAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 60, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Card className="bg-zinc-900/70 border border-white/10 hover:border-emerald-500/40 backdrop-blur-3xl rounded-3xl overflow-hidden h-full opacity-90 hover:opacity-100 transition-all">
                        <CardContent className="pt-9 pb-8 px-8 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-4 h-4 rounded-full bg-emerald-500" />
                            <span className="uppercase text-xs tracking-[2px] font-mono text-emerald-400">RESOLVED</span>
                          </div>

                          <h3 className="font-semibold text-2xl line-through text-zinc-400">
                            {alert.bookTitle}
                          </h3>

                          <div className="mt-8 space-y-4 text-sm">
                            <div className="bg-zinc-950/60 px-5 py-3.5 rounded-2xl border border-white/5 flex justify-between">
                              <span className="text-zinc-500">RFID Tag</span>
                              <span className="font-mono text-white">{alert.rfidTag}</span>
                            </div>
                            <div className="bg-zinc-950/60 px-5 py-3.5 rounded-2xl border border-white/5 flex justify-between">
                              <span className="text-zinc-500">Resolved on</span>
                              <span className="text-emerald-400">{alert.timestamp}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => deleteAlert(alert.id)}
                            variant="destructive"
                            className="mt-auto w-full h-12 rounded-2xl text-base"
                          >
                            <Trash2 className="w-5 h-5 mr-3" />
                            Delete Record
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>
      <p>h</p>
    </div>
  );
}
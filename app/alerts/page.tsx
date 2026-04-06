'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, AlertTriangle } from 'lucide-react';
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
            <AlertTriangle className="w-10 h-10 text-red-400" />
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter">
                Alerts Monitor
              </h1>
              <p className="text-zinc-400 mt-2 text-lg">
                Track and manage system alerts
              </p>
            </div>
          </div>
        </motion.div>

        {/* TABS */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-zinc-900/80 border border-white/10 backdrop-blur-xl rounded-2xl p-1 mb-8">
            <TabsTrigger
              value="active"
              className="rounded-xl data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
            >
              Active ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="rounded-xl data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              Resolved ({resolvedAlerts.length})
            </TabsTrigger>
          </TabsList>

          {/* ACTIVE ALERTS */}
          <TabsContent value="active">
            <AnimatePresence>
              {activeAlerts.length === 0 ? (
                <Card className="bg-zinc-900/50 border-white/10 rounded-3xl p-12 text-center">
                  <p className="text-zinc-400 text-lg">
                    No active alerts 🚀
                  </p>
                  <p className="text-zinc-500 mt-2">
                    System is running smoothly.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative group"
                    >
                      {/* Glow */}
                      <div className="absolute -inset-0.5 bg-red-500/20 blur-2xl opacity-20 group-hover:opacity-40 transition-all" />

                      <Card className="relative bg-zinc-900/80 border-white/10 hover:border-red-500/50 backdrop-blur-2xl rounded-3xl h-full">
                        <CardContent className="pt-6 pb-6 flex flex-col justify-between h-full">

                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                              <h3 className="font-bold text-xl">
                                {alert.bookTitle}
                              </h3>
                            </div>

                            <div className="text-sm bg-zinc-950/50 p-4 rounded-2xl space-y-2">
                              <p>
                                <span className="text-zinc-500">RFID:</span>{" "}
                                {alert.rfidTag}
                              </p>
                              <p>
                                <span className="text-zinc-500">Time:</span>{" "}
                                {alert.timestamp}
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() => resolveAlert(alert.id)}
                            className="mt-5 bg-amber-600 hover:bg-amber-700 rounded-xl"
                          >
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
          <TabsContent value="resolved">
            <AnimatePresence>
              {resolvedAlerts.length === 0 ? (
                <Card className="bg-zinc-900/50 border-white/10 rounded-3xl p-12 text-center">
                  <p className="text-zinc-400">
                    No resolved alerts yet.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resolvedAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="bg-zinc-900/70 border-white/10 backdrop-blur-xl rounded-3xl opacity-70 hover:opacity-100 transition">

                        <CardContent className="pt-6 pb-6 flex flex-col justify-between h-full">

                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              <h3 className="font-bold text-xl line-through">
                                {alert.bookTitle}
                              </h3>
                            </div>

                            <div className="text-sm bg-zinc-950/50 p-4 rounded-2xl space-y-2">
                              <p>
                                <span className="text-zinc-500">RFID:</span>{" "}
                                {alert.rfidTag}
                              </p>
                              <p>
                                <span className="text-zinc-500">Resolved:</span>{" "}
                                {alert.timestamp}
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={() => deleteAlert(alert.id)}
                            className="mt-5 bg-red-600 hover:bg-red-700 rounded-xl"
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
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
}
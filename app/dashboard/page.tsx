'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { LogOut, Plus, Send, Upload } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    amount: '',
    due_date: '',
    client_email: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [chasing, setChasing] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      setUser(user);
      await fetchInvoices();
      setLoading(false);
    };
    getUser();
  }, [router]);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setInvoices(data || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const extractWithAI = async () => {
    if (!file) return alert('Please upload a file first');

    setExtracting(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/extract', { method: 'POST', body });
      const data = await res.json();

      if (data.client_name || data.amount) {
        setFormData({
          client_name: data.client_name || '',
          amount: String(data.amount || ''),
          due_date: data.due_date || '',
          client_email: data.client_email || ''
        });
        alert('✅ AI Extracted details successfully!');
      } else {
        alert(data.error || 'Could not extract details. Please fill manually.');
      }
    } catch {
      alert('Extraction failed. Please fill manually.');
    } finally {
      setExtracting(false);
    }
  };

  const saveInvoice = async () => {
    if (!formData.client_name || !formData.amount) {
      return alert('Client name and amount are required');
    }
    if (!user) return alert('Not authenticated');

    const { error } = await supabase.from('invoices').insert({
      ...formData,
      amount: Number(formData.amount),
      user_id: user.id,
      status: 'pending'
    });

    if (error) {
      alert('Error saving invoice: ' + error.message);
    } else {
      alert('✅ Invoice saved successfully!');
      setShowModal(false);
      setFormData({ client_name: '', amount: '', due_date: '', client_email: '' });
      setFile(null);
      await fetchInvoices();
    }
  };

  const chaseNow = async (invoiceId: string) => {
    if (!confirm('Send AI chase email?')) return;
    setChasing(invoiceId);
    try {
      const res = await fetch('/api/chase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      });
      const data = await res.json();
      alert(data.success ? '✅ Chase email sent!' : 'Error: ' + (data.error || 'Unknown error'));
    } catch {
      alert('Failed to send chase email. Please try again.');
    } finally {
      setChasing(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🕵️</div>
          <p className="text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-lg">💰</div>
            <h1 className="text-4xl font-bold">AgentChase</h1>
          </div>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm text-zinc-500 hidden sm:block">{user.email}</span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Total Invoices</p>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">
              {invoices.filter(i => i.status === 'pending').length}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Total Value</p>
            <p className="text-3xl font-bold text-green-400">
              ₹{invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Invoices panel */}
        <div className="bg-zinc-900 rounded-3xl p-8">
          <div className="flex justify-between mb-8">
            <h2 className="text-2xl font-semibold">Your Invoices</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl transition-colors"
            >
              <Plus size={20} /> Add New Invoice
            </button>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-lg mb-2">No invoices yet</p>
              <p className="text-sm">Create your first invoice and let AI chase payments for you!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-zinc-800 p-6 rounded-2xl flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{inv.client_name}</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      ₹{Number(inv.amount).toLocaleString('en-IN')}
                      {inv.due_date && ` • Due ${inv.due_date}`}
                      {inv.client_email && ` • ${inv.client_email}`}
                    </p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                      inv.status === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <button
                    onClick={() => chaseNow(inv.id)}
                    disabled={chasing === inv.id}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-xl text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    <Send size={16} />
                    {chasing === inv.id ? 'Sending...' : 'Chase Now'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">New Invoice</h3>

            <div className="mb-6">
              <label className="block text-sm text-zinc-400 mb-2">Upload Invoice (PDF / Image)</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="w-full bg-zinc-800 rounded-2xl p-4 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:bg-zinc-700 file:text-white"
              />
              <button
                onClick={extractWithAI}
                disabled={!file || extracting}
                className="mt-3 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Upload size={18} />
                {extracting ? 'Extracting with AI...' : 'Let AI Extract Details'}
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Client Name *"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full bg-zinc-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="number"
                placeholder="Amount (₹) *"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-zinc-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full bg-zinc-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="email"
                placeholder="Client Email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                className="w-full bg-zinc-800 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-zinc-700 hover:bg-zinc-600 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveInvoice}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors font-semibold"
              >
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LogOut, Plus, Send, Upload } from 'lucide-react';

export default function Dashboard() {
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) await fetchInvoices();
      setLoading(false);
    };
    getUser();
  }, []);

  const fetchInvoices = async () => {
    const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    setInvoices(data || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const extractWithAI = async () => {
    if (!file) return alert("Please upload a file first");

    setExtracting(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.client_name) {
        setFormData({
          client_name: data.client_name || '',
          amount: data.amount || '',
          due_date: data.due_date || '',
          client_email: data.client_email || ''
        });
        alert("✅ AI Extracted details successfully!");
      } else {
        alert("Could not extract details. Please fill manually.");
      }
    } catch (err) {
      alert("Extraction failed. Please fill manually.");
    } finally {
      setExtracting(false);
    }
  };

  const saveInvoice = async () => {
    if (!formData.client_name || !formData.amount) {
      return alert("Client name and amount are required");
    }

    const { error } = await supabase.from('invoices').insert({
      ...formData,
      user_id: user.id,
      status: 'pending'
    });

    if (error) alert("Error saving invoice");
    else {
      alert("✅ Invoice saved successfully!");
      setShowModal(false);
      setFormData({ client_name: '', amount: '', due_date: '', client_email: '' });
      fetchInvoices();
    }
  };

  const chaseNow = async (invoiceId: string) => {
    if (!confirm("Send AI chase email?")) return;
    const res = await fetch('/api/chase', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ invoiceId }) });
    const data = await res.json();
    alert(data.success ? "✅ Chase email sent!" : "Error: " + data.error);
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">💰</div>
            <h1 className="text-4xl font-bold">AgentChase</h1>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8">
          <div className="flex justify-between mb-8">
            <h2 className="text-2xl font-semibold">Your Invoices</h2>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl">
              <Plus size={20} /> Add New Invoice
            </button>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No invoices yet. Create your first one!</div>
          ) : (
            <div className="grid gap-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="bg-zinc-800 p-6 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-medium">{inv.client_name}</p>
                    <p className="text-sm text-zinc-400">₹{inv.amount} • Due {inv.due_date}</p>
                  </div>
                  <button onClick={() => chaseNow(inv.id)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-xl text-sm">
                    <Send size={16} /> Chase Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI New Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-6">New Invoice</h3>

            <div className="mb-6">
              <label className="block text-sm mb-2">Upload Invoice (PDF/Image)</label>
              <input type="file" onChange={handleFileChange} accept="image/*,.pdf" className="w-full bg-zinc-800 rounded-2xl p-4" />
              <button onClick={extractWithAI} disabled={!file || extracting} className="mt-3 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-2xl flex items-center justify-center gap-2">
                <Upload size={18} /> {extracting ? 'Extracting...' : 'Let AI Extract Details'}
              </button>
            </div>

            <div className="space-y-4">
              <input type="text" placeholder="Client Name" value={formData.client_name} onChange={(e) => setFormData({...formData, client_name: e.target.value})} className="w-full bg-zinc-800 rounded-2xl p-4" />
              <input type="number" placeholder="Amount (₹)" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-zinc-800 rounded-2xl p-4" />
              <input type="date" value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} className="w-full bg-zinc-800 rounded-2xl p-4" />
              <input type="email" placeholder="Client Email" value={formData.client_email} onChange={(e) => setFormData({...formData, client_email: e.target.value})} className="w-full bg-zinc-800 rounded-2xl p-4" />
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-zinc-700 rounded-2xl">Cancel</button>
              <button onClick={saveInvoice} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl">Save Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

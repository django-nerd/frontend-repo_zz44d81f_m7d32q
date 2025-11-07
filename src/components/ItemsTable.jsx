import { useMemo, useState } from 'react';
import { Save, Trash2, X } from 'lucide-react';

const statuses = ['Pending', 'Paid'];

export default function ItemsTable({ items, onCreate, onUpdate, onDelete, filters, setFilters }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [newItem, setNewItem] = useState({ name: '', amount: '', status: 'Pending', rate: '', date: new Date().toISOString().slice(0,10) });

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (filters.status && i.status !== filters.status) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!i.name.toLowerCase().includes(q)) return false;
      }
      if (filters.startDate && new Date(i.date) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(i.date) > new Date(filters.endDate)) return false;
      if (filters.minAmount && Number(i.amount) < Number(filters.minAmount)) return false;
      if (filters.maxAmount && Number(i.amount) > Number(filters.maxAmount)) return false;
      return true;
    });
  }, [items, filters]);

  const startEdit = (i) => {
    setEditingId(i.id);
    setDraft({ name: i.name, amount: i.amount, status: i.status, rate: i.rate || '', date: i.date });
  };

  const cancelEdit = () => { setEditingId(null); setDraft({}); };
  const saveEdit = () => {
    if (!draft.name || !draft.amount) return;
    const total = calcTotal(draft.amount, draft.rate);
    onUpdate(editingId, { ...draft, total });
    cancelEdit();
  };

  const submitNew = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.amount) return;
    const total = calcTotal(newItem.amount, newItem.rate);
    onCreate({ ...newItem, total });
    setNewItem({ name: '', amount: '', status: 'Pending', rate: '', date: new Date().toISOString().slice(0,10) });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
        <input
          placeholder="Search items…"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={filters.startDate} onChange={(e)=>setFilters({ ...filters, startDate: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
        <input type="date" value={filters.endDate} onChange={(e)=>setFilters({ ...filters, endDate: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
        <input type="number" placeholder="Min Amount" value={filters.minAmount} onChange={(e)=>setFilters({ ...filters, minAmount: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
        <input type="number" placeholder="Max Amount" value={filters.maxAmount} onChange={(e)=>setFilters({ ...filters, maxAmount: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-300">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Rate %</th>
              <th className="py-2 px-3">Total</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-white">
            {filtered.map((i) => (
              <tr key={i.id}>
                <td className="py-2 px-3">
                  {editingId === i.id ? (
                    <input value={draft.name} onChange={(e)=>setDraft({ ...draft, name: e.target.value })} className="w-full px-2 py-1 rounded bg-slate-900/60 border border-white/10" />
                  ) : i.name}
                </td>
                <td className="py-2 px-3">
                  {editingId === i.id ? (
                    <input type="number" value={draft.amount} onChange={(e)=>setDraft({ ...draft, amount: e.target.value })} className="w-full px-2 py-1 rounded bg-slate-900/60 border border-white/10" />
                  ) : Number(i.amount).toLocaleString()}
                </td>
                <td className="py-2 px-3">
                  {editingId === i.id ? (
                    <input type="number" value={draft.rate} onChange={(e)=>setDraft({ ...draft, rate: e.target.value })} className="w-full px-2 py-1 rounded bg-slate-900/60 border border-white/10" />
                  ) : (i.rate || '—')}
                </td>
                <td className="py-2 px-3">{Number(i.total || 0).toLocaleString()}</td>
                <td className="py-2 px-3">
                  {editingId === i.id ? (
                    <select value={draft.status} onChange={(e)=>setDraft({ ...draft, status: e.target.value })} className="w-full px-2 py-1 rounded bg-slate-900/60 border border-white/10">
                      {statuses.map((s)=> <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span className={i.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}>{i.status}</span>
                  )}
                </td>
                <td className="py-2 px-3">{i.date}</td>
                <td className="py-2 px-3">
                  {editingId === i.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={saveEdit} className="p-1.5 rounded bg-emerald-500 hover:bg-emerald-600"><Save size={16} /></button>
                      <button onClick={cancelEdit} className="p-1.5 rounded bg-slate-600 hover:bg-slate-700"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={()=>startEdit(i)} className="p-1.5 rounded bg-indigo-500 hover:bg-indigo-600">Edit</button>
                      <button onClick={()=>onDelete(i.id)} className="p-1.5 rounded bg-rose-500 hover:bg-rose-600"><Trash2 size={16} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={submitNew} className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input value={newItem.name} onChange={(e)=>setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
        <input type="number" value={newItem.amount} onChange={(e)=>setNewItem({ ...newItem, amount: e.target.value })} placeholder="Amount" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
        <input type="number" value={newItem.rate} onChange={(e)=>setNewItem({ ...newItem, rate: e.target.value })} placeholder="Rate %" className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
        <select value={newItem.status} onChange={(e)=>setNewItem({ ...newItem, status: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white">
          {statuses.map((s)=> <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={newItem.date} onChange={(e)=>setNewItem({ ...newItem, date: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white" />
        <button className="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium">Add Item</button>
      </form>
    </div>
  );
}

function calcTotal(amount, rate) {
  const a = Number(amount) || 0;
  const r = Number(rate) || 0;
  return a + a * (r / 100);
}

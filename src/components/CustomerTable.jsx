import { useMemo, useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';

export default function CustomerTable({ customers, onCreate, onUpdate, onDelete }) {
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const startEdit = (c) => {
    setEditingId(c.id);
    setDraft({ name: c.name, phone: c.phone, address: c.address || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (!draft.name || !draft.phone) return;
    onUpdate(editingId, draft);
    cancelEdit();
  };

  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });

  const submitNew = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;
    onCreate(newCustomer);
    setNewCustomer({ name: '', phone: '', address: '' });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or phone…"
          className="w-full sm:w-64 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-300">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Phone</th>
              <th className="py-2 px-3">Address</th>
              <th className="py-2 px-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map((c) => (
              <tr key={c.id} className="text-white">
                <td className="py-2 px-3">
                  {editingId === c.id ? (
                    <input
                      className="w-full px-2 py-1 rounded bg-slate-900/60 border border-white/10"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    />
                  ) : (
                    c.name
                  )}
                </td>
                <td className="py-2 px-3">
                  {editingId === c.id ? (
                    <input
                      className="w-full px-2 py-1 rounded bg-slate-900/60 border border-white/10"
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    />
                  ) : (
                    c.phone
                  )}
                </td>
                <td className="py-2 px-3">
                  {editingId === c.id ? (
                    <input
                      className="w-full px-2 py-1 rounded bg-slate-900/60 border border-white/10"
                      value={draft.address}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                    />
                  ) : (
                    c.address || '—'
                  )}
                </td>
                <td className="py-2 px-3">
                  {editingId === c.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={saveEdit} className="p-1.5 rounded bg-emerald-500 hover:bg-emerald-600">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 rounded bg-slate-600 hover:bg-slate-700">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(c)} className="p-1.5 rounded bg-indigo-500 hover:bg-indigo-600">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => onDelete(c.id)} className="p-1.5 rounded bg-rose-500 hover:bg-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={submitNew} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          placeholder="Customer name"
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          placeholder="Phone number"
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          value={newCustomer.address}
          onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
          placeholder="Address (optional)"
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium">Add Customer</button>
      </form>
    </div>
  );
}

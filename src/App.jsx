import { useMemo, useState } from 'react';
import AuthForm from './components/AuthForm';
import CustomerTable from './components/CustomerTable';
import ItemsTable from './components/ItemsTable';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [itemFilters, setItemFilters] = useState({ query: '', status: '', startDate: '', endDate: '', minAmount: '', maxAmount: '' });

  const activeCustomer = useMemo(() => customers.find(c => c.id === activeCustomerId) || null, [customers, activeCustomerId]);

  const handleAuth = (u) => {
    setUser(u);
  };

  const createCustomer = (data) => {
    const id = crypto.randomUUID();
    setCustomers((prev) => [...prev, { id, name: data.name, phone: data.phone, address: data.address }]);
    if (!activeCustomerId) setActiveCustomerId(id);
  };

  const updateCustomer = (id, patch) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.customerId !== id));
    if (activeCustomerId === id) setActiveCustomerId(null);
  };

  const createItem = (data) => {
    if (!activeCustomerId) return;
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, customerId: activeCustomerId, ...data }]);
  };

  const updateItem = (id, patch) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const customerItems = useMemo(() => items.filter((i) => i.customerId === activeCustomerId), [items, activeCustomerId]);

  if (!user) {
    return <AuthForm onAuthenticated={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-white/10 sticky top-0 backdrop-blur bg-slate-950/60 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500 grid place-items-center font-bold">B</div>
            <div>
              <div className="font-semibold">Billing Manager</div>
              <div className="text-xs text-slate-400">Secure customer, item & invoice management</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">{user.email} · {user.role}</span>
            <button onClick={() => setUser(null)} className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-sm">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <Dashboard customers={customers} items={items} />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold">Customers</h2>
            <CustomerTable
              customers={customers}
              onCreate={createCustomer}
              onUpdate={updateCustomer}
              onDelete={deleteCustomer}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Items</h2>
              <select
                value={activeCustomerId || ''}
                onChange={(e) => setActiveCustomerId(e.target.value || null)}
                className="px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white"
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
                ))}
              </select>
            </div>
            {activeCustomer ? (
              <div className="space-y-4">
                <div className="text-slate-300 text-sm">Active customer: <span className="text-white font-medium">{activeCustomer.name}</span></div>
                <ItemsTable
                  items={customerItems}
                  onCreate={createItem}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                  filters={itemFilters}
                  setFilters={setItemFilters}
                />
              </div>
            ) : (
              <div className="text-slate-400 text-sm">Select a customer to manage their items.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

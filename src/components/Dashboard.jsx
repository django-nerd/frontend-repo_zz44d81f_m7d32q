import { useMemo } from 'react';

export default function Dashboard({ customers, items }) {
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalPaid = items.filter(i => i.status === 'Paid').reduce((s, i) => s + Number(i.total || i.amount || 0), 0);
    const totalDue = items.filter(i => i.status !== 'Paid').reduce((s, i) => s + Number(i.total || i.amount || 0), 0);
    const pendingBalance = totalDue;
    return { totalCustomers, totalPaid, totalDue, pendingBalance };
  }, [customers, items]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard label="Total Customers" value={stats.totalCustomers} />
      <StatCard label="Total Paid" value={stats.totalPaid} prefix="$" />
      <StatCard label="Total Due" value={stats.totalDue} prefix="$" />
      <StatCard label="Pending Balance" value={stats.pendingBalance} prefix="$" />
    </div>
  );
}

function StatCard({ label, value, prefix = '' }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white">
      <div className="text-slate-300 text-sm">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </div>
  );
}

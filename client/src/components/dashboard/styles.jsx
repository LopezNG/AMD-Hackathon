export const statusStyles = {
  strong: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'on track': 'bg-blue-50 text-blue-700 border-blue-200',
  watch: 'bg-amber-50 text-amber-700 border-amber-200',
  'due soon': 'bg-amber-50 text-amber-700 border-amber-200',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export const agentStyles = {
  'Pulse Agent': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  'Sense-Maker Agent': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Success Agent': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Admin-Strategy Agent': 'bg-amber-50 text-amber-800 border-amber-200'
};

export function Card({ children, className = '' }) {
  return <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

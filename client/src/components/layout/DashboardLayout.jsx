import { useState } from 'react';
import { Bell, BookOpen, CalendarDays, FileText, LayoutDashboard, Menu, MessageSquareText, Search, Sparkles, X } from 'lucide-react';
import EduSenseAssistant from '../assistant/EduSenseAssistant.jsx';

export default function DashboardLayout({ student, children }) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const nav = [
    ['Dashboard', LayoutDashboard],
    ['Courses', BookOpen],
    ['Assignments', FileText],
    ['Calendar', CalendarDays],
    ['Support', MessageSquareText]
  ];

  return (
    <div className="min-h-screen bg-[#f4f8fc] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-navy-900 px-4 py-5 text-white lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-edu-teal text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-lg font-bold">EduSense</p>
            <p className="text-xs text-blue-200">Northgate Academy</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {nav.map(([label, Icon], index) => (
            <button
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                index === 0 ? 'bg-white/12 text-white' : 'text-blue-100 hover:bg-white/8'
              }`}
              key={label}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-white/8 p-4">
          <p className="text-sm font-semibold">AI support layer</p>
          <p className="mt-1 text-xs leading-5 text-blue-100">Rule-based prototype connected to mock LMS context.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-slate-200 p-2 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open navigation">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student dashboard</p>
                <h1 className="text-xl font-bold text-navy-900 md:text-2xl">Good morning, {student?.name ?? 'student'}</h1>
              </div>
            </div>
            <div className="hidden min-w-[280px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 md:flex">
              <Search size={17} />
              <span className="text-sm">Search courses, deadlines, support</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600" aria-label="Notifications">
                <Bell size={19} />
              </button>
              <div className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 sm:flex">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-navy-100 text-sm font-bold text-navy-800">VC</div>
                <div className="text-sm">
                  <p className="font-semibold text-navy-900">{student?.grade}</p>
                  <p className="text-xs text-slate-500">Section {student?.section}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 md:px-6">
          <div className="mx-auto min-w-0 max-w-7xl space-y-5">{children}</div>
        </main>
      </div>

      {!assistantOpen && (
        <button
          className="fixed bottom-5 right-5 z-40 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-edu-teal to-navy-700 text-white shadow-[0_18px_45px_rgba(19,168,162,0.35)] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-edu-teal/25"
          onClick={() => setAssistantOpen(true)}
          aria-label="Open EduSense assistant"
        >
          <Sparkles size={27} />
          <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
        </button>
      )}

      {navOpen && (
        <div className="fixed inset-0 z-50 bg-navy-900/40 lg:hidden">
          <div className="flex h-full w-72 flex-col bg-navy-900 p-5 text-white shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-edu-teal">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="font-bold">EduSense</p>
                  <p className="text-xs text-blue-200">{student?.school}</p>
                </div>
              </div>
              <button className="rounded-lg border border-white/20 p-2" onClick={() => setNavOpen(false)} aria-label="Close navigation">
                <X size={18} />
              </button>
            </div>
            <nav className="mt-8 space-y-1">
              {nav.map(([label, Icon], index) => (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                    index === 0 ? 'bg-white/12 text-white' : 'text-blue-100 hover:bg-white/8'
                  }`}
                  key={label}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {assistantOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <button
            className="pointer-events-auto absolute inset-0 bg-navy-900/40 md:hidden"
            onClick={() => setAssistantOpen(false)}
            aria-label="Close assistant backdrop"
          />
          <EduSenseAssistant student={student} onClose={() => setAssistantOpen(false)} onMinimize={() => setAssistantOpen(false)} />
        </div>
      )}
    </div>
  );
}

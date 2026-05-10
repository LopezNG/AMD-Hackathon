import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  Mic,
  Minus,
  Paperclip,
  MessageSquareText,
  Search,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  X
} from 'lucide-react';

const api = (path) => fetch(`/api/${path}`).then((response) => response.json());

const statusStyles = {
  strong: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'on track': 'bg-blue-50 text-blue-700 border-blue-200',
  watch: 'bg-amber-50 text-amber-700 border-amber-200',
  'due soon': 'bg-amber-50 text-amber-700 border-amber-200',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

const agentStyles = {
  'Pulse Agent': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  'Sense-Maker Agent': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Success Agent': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Admin-Strategy Agent': 'bg-amber-50 text-amber-800 border-amber-200'
};

function Card({ children, className = '' }) {
  return <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

function Stat({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-navy-900">{value}</p>
        </div>
        <div className="rounded-lg bg-edu-sky p-2 text-navy-700">
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function DashboardLayout({ student, children }) {
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

function StudentOverview({ student, assignments }) {
  const pending = assignments.filter((assignment) => assignment.status !== 'completed').length;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="GPA" value={student.gpa.toFixed(2)} helper={`${student.creditsEarned}/${student.creditsRequired} credits earned`} icon={GraduationCap} />
      <Stat label="Attendance" value={`${student.attendanceRate}%`} helper="Strong overall attendance" icon={CheckCircle2} />
      <Stat label="Pending tasks" value={pending} helper="One task needs immediate attention" icon={Clock3} />
      <Stat label="Wellbeing" value={student.wellbeingScore} helper={`Risk level: ${student.riskLevel}`} icon={ShieldCheck} />
    </div>
  );
}

function CoursesList({ courses }) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-navy-900">Courses</h2>
          <p className="text-sm text-slate-500">Current academic progress</p>
        </div>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-navy-700">View all</button>
      </div>
      <div className="space-y-3">
        {courses.map((course) => (
          <div className="rounded-lg border border-slate-200 p-3" key={course.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-navy-900">{course.name}</p>
                <p className="text-sm text-slate-500">{course.teacher} · {course.room}</p>
              </div>
              <span className={`rounded-md border px-2 py-1 text-xs font-bold capitalize ${statusStyles[course.status]}`}>
                {course.status}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-edu-teal" style={{ width: `${course.progress}%` }} />
              </div>
              <span className="w-16 text-right text-sm font-bold text-navy-900">{course.currentGrade}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AssignmentsList({ assignments }) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-navy-900">Assignments</h2>
          <p className="text-sm text-slate-500">Prioritized by deadline and status</p>
        </div>
        <FileText className="text-edu-teal" size={20} />
      </div>
      <div className="space-y-3">
        {assignments.map((assignment) => (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3" key={assignment.id}>
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy-900">{assignment.title}</p>
              <p className="text-sm text-slate-500">{assignment.course} · Due {new Date(`${assignment.dueDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <span className={`rounded-md border px-2 py-1 text-xs font-bold capitalize ${statusStyles[assignment.status]}`}>
                {assignment.status}
              </span>
              <p className="mt-1 text-xs text-slate-500">{assignment.priority} priority</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Announcements({ announcements }) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-navy-900">Announcements</h2>
          <p className="text-sm text-slate-500">Latest school and course updates</p>
        </div>
        <Bell className="text-navy-500" size={20} />
      </div>
      <div className="space-y-3">
        {announcements.map((item) => (
          <article className="rounded-lg bg-slate-50 p-3" key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-navy-900">{item.title}</p>
              <span className="shrink-0 text-xs font-semibold text-slate-500">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{item.body}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-edu-teal">{item.source}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ScheduleSummary({ schedule, attendance }) {
  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-navy-900">Today</h2>
          <p className="text-sm text-slate-500">{attendance.trend}</p>
        </div>
        <CalendarDays className="text-edu-teal" size={20} />
      </div>
      <div className="space-y-3">
        {schedule.map((item) => (
          <div className="flex items-center gap-3" key={item.id}>
            <div className="w-20 rounded-lg bg-edu-sky px-2 py-2 text-center text-xs font-bold text-navy-700">{item.time}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy-900">{item.course}</p>
              <p className="text-sm text-slate-500">{item.room} · {item.teacher}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AgentActivityPanel({ themes }) {
  return (
    <Card className="p-4">
      <div className="mb-4">
        <h2 className="font-bold text-navy-900">Agent Activity</h2>
        <p className="text-sm text-slate-500">Signals EduSense is watching</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {themes.map((theme) => (
          <div className="rounded-lg border border-slate-200 p-3" key={`${theme.agent}-${theme.theme}`}>
            <span className={`rounded-md border px-2 py-1 text-xs font-bold ${agentStyles[theme.agent]}`}>{theme.agent}</span>
            <p className="mt-3 font-semibold text-navy-900">{theme.theme}</p>
            <p className="mt-1 text-sm text-slate-500">{theme.signal}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EduSenseAssistant({ student, onClose, onMinimize }) {
  const initialMessages = useMemo(
    () => [
      {
        role: 'assistant',
        agent: 'Pulse Agent',
        content: `Hi ${student?.name ?? 'Sarah'}! I noticed you were not able to make it to Advanced Calculus again this morning. Everything okay? We missed you.`
      },
      {
        role: 'user',
        content: 'I had to leave home really early, but the bus was delayed again. By the time I got to campus, class was almost over.'
      },
      {
        role: 'assistant',
        agent: 'Sense-Maker Agent',
        tag: 'Identified: Commuter Fatigue',
        content: 'Repeated morning absences line up with travel disruption rather than disengagement. Attendance support should focus on schedule friction and recovery access.'
      },
      {
        role: 'assistant',
        agent: 'Success Agent',
        content: 'Recommendation: send Dr. Kim a context note, unlock the recorded lecture for today, and suggest a later office-hour slot before the quiz review.',
        actions: [{ title: 'Draft advisor update', detail: 'Share attendance context and recommended calculus catch-up plan' }]
      }
    ],
    [student?.name]
  );
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('edusense-popup-chat-v1');
    return saved ? JSON.parse(saved) : initialMessages;
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('edusense-popup-chat-v1', JSON.stringify(messages));
  }, [messages]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setLoading(true);
    try {
      const response = await fetch('/api/assistant/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, message: trimmed })
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          agent: data.agent,
          content: data.reply,
          actions: data.actions
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          agent: 'Admin-Strategy Agent',
          content: 'I could not reach the EduSense mock API. Please check the local server and try again.',
          actions: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = ['Open lecture recording', 'Draft teacher note', 'Find later office hours'];

  return (
    <section className="pointer-events-auto fixed inset-x-3 bottom-3 z-50 flex h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl border border-edu-teal/30 bg-white shadow-[0_26px_70px_rgba(15,31,61,0.24)] md:inset-auto md:bottom-6 md:right-6 md:h-[86vh] md:w-[410px] md:max-w-[calc(100vw-3rem)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-edu-teal to-navy-700 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
              <Sparkles size={20} />
              <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">EduSense</h2>
              <p className="text-sm text-blue-50">Your Success Partner</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20" onClick={onMinimize} aria-label="Minimize assistant">
              <Minus size={17} />
            </button>
            <button className="rounded-lg border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20" onClick={onClose} aria-label="Close assistant">
              <X size={17} />
            </button>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-white/20 bg-white/12 px-3 py-2 text-sm">
          <span className="font-semibold">Context:</span> Attendance Check / Advanced Calculus
        </div>
      </div>

      <div className="scrollbar-slim flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div className={message.role === 'user' ? 'ml-8 flex justify-end' : 'mr-4'} key={`${message.role}-${index}`}>
            <div className={`max-w-full rounded-2xl border p-3 shadow-sm ${message.role === 'user' ? 'border-navy-700 bg-navy-800 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
              {message.agent && (
                <span className={`mb-2 inline-flex rounded-md border px-2 py-1 text-xs font-bold ${agentStyles[message.agent]}`}>
                  {message.agent}
                </span>
              )}
              {message.tag && <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">{message.tag}</p>}
              <p className="text-sm leading-6">{message.content}</p>
              {message.actions?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action) => (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={action.title}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-navy-900">{action.title}</p>
                        <ChevronRight size={16} className="text-edu-teal" />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{action.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mr-10 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500">
            <span className="font-semibold text-edu-teal">EduSense</span> is reading LMS context...
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-700 hover:border-edu-teal hover:text-edu-teal"
              key={suggestion}
              onClick={() => sendMessage(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-edu-teal focus:ring-2 focus:ring-edu-teal/20"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your response here..."
          />
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-edu-teal hover:text-edu-teal" type="button" aria-label="Attach file">
            <Paperclip size={18} />
          </button>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-edu-teal hover:text-edu-teal" type="button" aria-label="Use microphone">
            <Mic size={18} />
          </button>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-edu-teal text-white hover:bg-navy-700" type="submit" aria-label="Send response">
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api('student'),
      api('courses'),
      api('assignments'),
      api('announcements'),
      api('grades'),
      api('attendance'),
      api('schedule'),
      api('agentThemes')
    ])
      .then(([student, courses, assignments, announcements, grades, attendance, schedule, agentThemes]) => {
        setData({ student, courses, assignments, announcements, grades, attendance, schedule, agentThemes });
      })
      .catch(() => setError('Could not load the EduSense mock LMS API.'));
  }, []);

  if (error) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center text-navy-900">{error}</div>;
  }

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
          <Sparkles className="mx-auto text-edu-teal" />
          <p className="mt-3 font-bold text-navy-900">Loading EduSense</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout student={data.student}>
      <StudentOverview student={data.student} assignments={data.assignments} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <CoursesList courses={data.courses} />
        <AssignmentsList assignments={data.assignments} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Announcements announcements={data.announcements} />
        <ScheduleSummary schedule={data.schedule} attendance={data.attendance} />
      </div>
      <AgentActivityPanel themes={data.agentThemes} />
      <Card className="overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1fr_280px]">
          <div className="p-5">
            <div className="flex items-center gap-2 text-edu-teal">
              <TrendingUp size={19} />
              <p className="text-sm font-bold uppercase tracking-wide">Context summary</p>
            </div>
            <h2 className="mt-2 text-lg font-bold text-navy-900">EduSense is currently prioritizing deadline recovery and morning energy.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This simulated dashboard gives the assistant access to assignments, rubric updates, grades, attendance patterns, schedule details, and support interventions using local JSON data.
            </p>
          </div>
          <div className="border-t border-slate-200 bg-edu-mint p-5 md:border-l md:border-t-0">
            <div className="flex items-center gap-2 text-navy-800">
              <UsersRound size={18} />
              <p className="font-bold">Advisor handoff</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">Maya Hernandez can see the same signals and recommended support actions.</p>
            <button className="mt-4 flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-2 text-sm font-bold text-white">
              <Library size={16} />
              Open support plan
            </button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}

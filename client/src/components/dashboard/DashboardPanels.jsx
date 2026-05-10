import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Library,
  ShieldCheck,
  TrendingUp,
  UsersRound
} from 'lucide-react';
import { Card, agentStyles, statusStyles } from './styles.jsx';

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

export function StudentOverview({ student, assignments }) {
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

export function CoursesList({ courses }) {
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
                <p className="text-sm text-slate-500">{course.teacher} - {course.room}</p>
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

export function AssignmentsList({ assignments }) {
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
              <p className="text-sm text-slate-500">{assignment.course} - Due {new Date(`${assignment.dueDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
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

export function Announcements({ announcements }) {
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

export function ScheduleSummary({ schedule, attendance }) {
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
              <p className="text-sm text-slate-500">{item.room} - {item.teacher}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AgentActivityPanel({ themes }) {
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

export function ContextSummaryCard() {
  return (
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
  );
}

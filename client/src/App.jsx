import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  AgentActivityPanel,
  Announcements,
  AssignmentsList,
  ContextSummaryCard,
  CoursesList,
  ScheduleSummary,
  StudentOverview
} from './components/dashboard/DashboardPanels.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import { getDashboardData } from './services/api.js';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardData()
      .then(setData)
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
      <ContextSummaryCard />
    </DashboardLayout>
  );
}

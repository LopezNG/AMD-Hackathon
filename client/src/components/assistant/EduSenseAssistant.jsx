import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Mic, Minus, Paperclip, SendHorizontal, Sparkles, X } from 'lucide-react';
import { sendAssistantMessage } from '../../services/api.js';
import { agentStyles } from '../dashboard/styles.jsx';

export default function EduSenseAssistant({ student, onClose, onMinimize }) {
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
      const data = await sendAssistantMessage({ studentId: student.id, message: trimmed });
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

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus, Lightbulb, Send, CheckCircle, X } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { ToolHeader } from '../../components/common/ToolHeader';
import { PageSEO } from '../../components/seo/PageSEO';
import { useSpamGuard } from '../../hooks/useSpamGuard';
import {
  FORUM_CATEGORIES,
  type ForumThread,
  categoryLabel,
  createThread,
  fetchThreads,
  timeAgo,
} from '../../services/forumService';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'DiscussionForumPosting',
  headline: 'AIRigCheck Community Forums',
  url: 'https://airigcheck.com/forums',
};

const inputClass =
  'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

const NewThreadForm: React.FC<{ onCreated: (t: ForumThread) => void; onCancel: () => void }> = ({
  onCreated,
  onCancel,
}) => {
  const [form, setForm] = useState({ author_name: '', title: '', category: 'general', body: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [error, setError] = useState('');
  const { isLikelySpam } = useSpamGuard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLikelySpam(form.website)) {
      setError('Submission rejected. If this seems wrong, wait a moment and try again.');
      return;
    }
    if (form.title.trim().length < 3) {
      setError('Title needs to be at least 3 characters.');
      return;
    }
    if (!form.author_name.trim() || !form.body.trim()) {
      setError('Name and message are required.');
      return;
    }

    setStatus('sending');
    try {
      const thread = await createThread({
        author_name: form.author_name.trim().slice(0, 60),
        title: form.title.trim().slice(0, 150),
        body: form.body.trim().slice(0, 5000),
        category: form.category,
      });
      onCreated(thread);
    } catch {
      setStatus('error');
      setError('Something went wrong posting your thread. Please try again.');
    }
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white">Start a new thread</h3>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Honeypot field - hidden from real users */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={e => setForm({ ...form, website: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name *"
            value={form.author_name}
            onChange={e => setForm({ ...form, author_name: e.target.value })}
            maxLength={60}
            className={inputClass}
          />
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {FORUM_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Title *"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          maxLength={150}
          className={inputClass}
        />

        <textarea
          placeholder="What's on your mind? *"
          value={form.body}
          onChange={e => setForm({ ...form, body: e.target.value })}
          rows={5}
          maxLength={5000}
          className={inputClass}
          style={{ resize: 'vertical' }}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          {status === 'sending' ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
          Post thread
        </button>
      </form>
    </Card>
  );
};

const SuggestFeatureBox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Feature Request', email: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const { isLikelySpam } = useSpamGuard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLikelySpam(form.website) || !form.message.trim()) return;

    setStatus('sending');
    try {
      const response = await fetch('https://formsubmit.co/ajax/support@airigcheck.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          email: form.email || 'not provided',
          message: form.message,
          _subject: `AIRigCheck Forum: ${form.type}`,
          _template: 'table',
        }),
      });
      if (response.ok) {
        setStatus('success');
        setForm({ type: 'Feature Request', email: '', message: '', website: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <Card className="p-5 mb-6 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300 text-sm">
          <Lightbulb size={16} />
          Suggest a feature or report something broken
        </span>
        <span className="text-xs text-amber-600 dark:text-amber-400">{open ? 'Close' : 'Open'}</span>
      </button>

      {open && (
        <div className="mt-4">
          {status === 'success' ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm py-2">
              <CheckCircle size={16} /> Thanks — this was emailed to the site owner directly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className={inputClass}
                >
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>Other Feedback</option>
                </select>
                <input
                  type="email"
                  placeholder="Your email (optional, for follow-up)"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <textarea
                required
                placeholder="What would you like added, or what's broken?"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={3}
                className={inputClass}
                style={{ resize: 'vertical' }}
              />
              {status === 'error' && (
                <p className="text-xs text-red-500">Something went wrong — try again or email support@airigcheck.com directly.</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {status === 'sending' ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Send to site owner
              </button>
            </form>
          )}
        </div>
      )}
    </Card>
  );
};

export const ForumsPage: React.FC = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = (cat: string) => {
    setLoading(true);
    setLoadError(false);
    fetchThreads(cat)
      .then(setThreads)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <PageSEO
        title="Community Forums | AIRigCheck"
        description="Ask questions, share your rig, and talk GPUs, local LLMs, and cloud AI pricing with other AIRigCheck users."
        canonical="https://airigcheck.com/forums"
        schema={schema}
      />

      <ToolHeader
        icon={<MessageSquare className="text-blue-500" size={22} />}
        title="Community Forums"
        description="Ask about hardware, share your rig, compare notes on models and cloud pricing — no account needed."
      />

      <SuggestFeatureBox />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${category === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            All
          </button>
          {FORUM_CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${category === c.value ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowNewForm(v => !v)}
          className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> New thread
        </button>
      </div>

      {showNewForm && (
        <NewThreadForm
          onCreated={t => {
            setThreads(prev => [t, ...prev]);
            setShowNewForm(false);
          }}
          onCancel={() => setShowNewForm(false)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : loadError ? (
        <Card className="p-8 text-center text-slate-500">Couldn't load threads. Please refresh the page.</Card>
      ) : threads.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">No threads yet — be the first to post.</Card>
      ) : (
        <div className="space-y-3">
          {threads.map(t => (
            <Link key={t.id} to={`/forums/${t.id}`}>
              <Card className="p-5 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {categoryLabel(t.category)}
                  </span>
                  <span className="text-xs text-slate-400">{timeAgo(t.last_activity_at)}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{t.body}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>by {t.author_name}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} /> {t.reply_count} {t.reply_count === 1 ? 'reply' : 'replies'}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

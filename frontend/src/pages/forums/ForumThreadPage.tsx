import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { PageSEO } from '../../components/seo/PageSEO';
import { useSpamGuard } from '../../hooks/useSpamGuard';
import {
  type ForumReply,
  type ForumThread,
  categoryLabel,
  createReply,
  fetchReplies,
  fetchThread,
  timeAgo,
} from '../../services/forumService';

const inputClass =
  'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

export const ForumThreadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [replyForm, setReplyForm] = useState({ author_name: '', body: '', website: '' });
  const [replyStatus, setReplyStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [replyError, setReplyError] = useState('');
  const { isLikelySpam } = useSpamGuard();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchThread(id), fetchReplies(id)])
      .then(([t, r]) => {
        setThread(t);
        setReplies(r);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError('');
    if (!id) return;

    if (isLikelySpam(replyForm.website)) {
      setReplyError('Submission rejected. If this seems wrong, wait a moment and try again.');
      return;
    }
    if (!replyForm.author_name.trim() || !replyForm.body.trim()) {
      setReplyError('Name and message are required.');
      return;
    }

    setReplyStatus('sending');
    try {
      const reply = await createReply(id, {
        author_name: replyForm.author_name.trim().slice(0, 60),
        body: replyForm.body.trim().slice(0, 5000),
      });
      setReplies(prev => [...prev, reply]);
      setThread(t => (t ? { ...t, reply_count: t.reply_count + 1 } : t));
      setReplyForm({ author_name: replyForm.author_name, body: '', website: '' });
      setReplyStatus('idle');
    } catch {
      setReplyStatus('error');
      setReplyError('Something went wrong posting your reply. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !thread) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <PageSEO
          title="Thread not found | AIRigCheck Forums"
          description="This forum thread could not be found."
          canonical="https://airigcheck.com/forums"
        />
        <p className="text-slate-500 mb-4">This thread doesn't exist or was removed.</p>
        <Link to="/forums" className="text-blue-500 hover:underline text-sm">Back to Forums</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <PageSEO
        title={`${thread.title} | AIRigCheck Forums`}
        description={thread.body.slice(0, 155)}
        canonical={`https://airigcheck.com/forums/${thread.id}`}
      />

      <Link to="/forums" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Forums
      </Link>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            {categoryLabel(thread.category)}
          </span>
          <span className="text-xs text-slate-400">{timeAgo(thread.created_at)}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{thread.title}</h1>
        <p className="text-xs text-slate-400 mb-4">Posted by {thread.author_name}</p>
        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{thread.body}</p>
      </Card>

      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          <MessageSquare size={14} /> {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>
        <div className="space-y-3">
          {replies.map(r => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{r.author_name}</span>
                <span className="text-xs text-slate-400">{timeAgo(r.created_at)}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{r.body}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Post a reply</h3>
        <form onSubmit={handleReply} className="space-y-3">
          <input
            type="text"
            name="website"
            value={replyForm.website}
            onChange={e => setReplyForm({ ...replyForm, website: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Your name *"
            value={replyForm.author_name}
            onChange={e => setReplyForm({ ...replyForm, author_name: e.target.value })}
            maxLength={60}
            className={inputClass}
          />
          <textarea
            placeholder="Write a reply *"
            value={replyForm.body}
            onChange={e => setReplyForm({ ...replyForm, body: e.target.value })}
            rows={4}
            maxLength={5000}
            className={inputClass}
            style={{ resize: 'vertical' }}
          />
          {replyError && <p className="text-sm text-red-500">{replyError}</p>}
          <button
            type="submit"
            disabled={replyStatus === 'sending'}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            {replyStatus === 'sending' ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Post reply
          </button>
        </form>
      </Card>
    </motion.div>
  );
};

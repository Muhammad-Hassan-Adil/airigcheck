import { supabase } from './supabaseClient';

export interface ForumThread {
  id: string;
  author_name: string;
  title: string;
  body: string;
  category: string;
  reply_count: number;
  created_at: string;
  last_activity_at: string;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export const FORUM_CATEGORIES = [
  { value: 'general', label: 'General Discussion' },
  { value: 'hardware', label: 'Hardware & GPUs' },
  { value: 'models-cloud', label: 'Models & Cloud APIs' },
  { value: 'showcase', label: 'Show Your Rig' },
  { value: 'help', label: 'Help & Troubleshooting' },
] as const;

export type ForumCategory = typeof FORUM_CATEGORIES[number]['value'];

export function categoryLabel(value: string): string {
  return FORUM_CATEGORIES.find(c => c.value === value)?.label ?? value;
}

export async function fetchThreads(category?: string): Promise<ForumThread[]> {
  let query = supabase
    .from('forum_threads')
    .select('*')
    .order('last_activity_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchThread(id: string): Promise<ForumThread> {
  const { data, error } = await supabase.from('forum_threads').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function fetchReplies(threadId: string): Promise<ForumReply[]> {
  const { data, error } = await supabase
    .from('forum_replies')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createThread(input: {
  author_name: string;
  title: string;
  body: string;
  category: string;
}): Promise<ForumThread> {
  const { data, error } = await supabase.from('forum_threads').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function createReply(
  threadId: string,
  input: { author_name: string; body: string }
): Promise<ForumReply> {
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({ thread_id: threadId, ...input })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [604800, 'w'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ];
  for (const [secs, label] of intervals) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return 'just now';
}

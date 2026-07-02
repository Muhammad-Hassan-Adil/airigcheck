import { useRef } from 'react';

const MIN_SUBMIT_MS = 2500;

/**
 * Lightweight client-side spam deterrent: a honeypot field bots tend to fill,
 * plus a minimum time-on-form before a submit is accepted. Not a substitute
 * for server-side moderation, but cuts down naive bot traffic.
 */
export function useSpamGuard() {
  const mountTime = useRef(Date.now());

  const isLikelySpam = (honeypotValue: string): boolean => {
    return Boolean(honeypotValue) || Date.now() - mountTime.current < MIN_SUBMIT_MS;
  };

  return { isLikelySpam };
}

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'analytics-session';
const SESSION_PAGES_KEY = 'analytics-session-pages';
const VISITOR_KEY = 'analytics-visitor';
const PREV_PATH_KEY = 'analytics-prev-path';
const UTM_KEY = 'analytics-utm';

function getStored(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem(key); } catch { return null; }
}

function setStored(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, value); } catch {}
}

function getStoredNumber(key: string): number {
    return Number(getStored(key) || '0');
}

function isNewSession(): boolean {
    const now = Date.now();
    const last = getStored(SESSION_KEY);
    setStored(SESSION_KEY, String(now));
    if (!last) return true;
    if (now - Number(last) > 30 * 60 * 1000) {
        setStored(SESSION_PAGES_KEY, '0');
        return true;
    }
    return false;
}

function isNewVisitor(): boolean {
    if (getStored(VISITOR_KEY)) return false;
    setStored(VISITOR_KEY, Date.now().toString());
    return true;
}

function getSessionPages(): number {
    return getStoredNumber(SESSION_PAGES_KEY);
}

function incrementSessionPages(): number {
    const next = getSessionPages() + 1;
    setStored(SESSION_PAGES_KEY, String(next));
    return next;
}

function getPrevPath(): string {
    if (typeof window === 'undefined') return '';
    const prev = sessionStorage.getItem(PREV_PATH_KEY) || '';
    sessionStorage.setItem(PREV_PATH_KEY, window.location.pathname);
    return prev;
}

function parseUTM(): { source: string; medium: string; campaign: string; term: string; content: string } {
    if (typeof window === 'undefined') return { source: '', medium: '', campaign: '', term: '', content: '' };
    const params = new URLSearchParams(window.location.search);
    const utm = {
        source: params.get('utm_source') || '',
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || '',
        term: params.get('utm_term') || '',
        content: params.get('utm_content') || '',
    };
    if (utm.source || utm.medium || utm.campaign) {
        setStored(UTM_KEY, JSON.stringify(utm));
    }
    try {
        const storedUtm = JSON.parse(getStored(UTM_KEY) || '{}');
        if (storedUtm.source || storedUtm.medium || storedUtm.campaign) {
            return storedUtm;
        }
    } catch {}
    return utm;
}

function getMaxScrollDepth(): number {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return 100;
    return Math.round((window.scrollY / h) * 100);
}

function getWebVitals(): { lcp: number; cls: number; inp: number } {
    if (typeof window === 'undefined') return { lcp: 0, cls: 0, inp: 0 };
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lcp = lcpEntries.length > 0 ? (lcpEntries[lcpEntries.length - 1] as PerformanceEntry).startTime : 0;
    const cls = 0;
    const firstInput = performance.getEntriesByType('first-input') as PerformanceEventTiming[];
    const inp = firstInput.length > 0 ? firstInput[0].processingStart - firstInput[0].startTime : 0;
    return { lcp: Math.round(lcp), cls, inp: Math.round(inp) };
}

function trackExternalLinkClicks(pathname: string): () => void {
    const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('/') || href.startsWith('#') || href.includes('lalitmadan.com')) return;
        fetch('/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'external_link_click', path: pathname }),
            keepalive: true,
        }).catch(() => {});
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
}

export function useAnalytics() {
    const pathname = usePathname();
    const viewSentRef = useRef(false);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const elapsedRef = useRef(0);
    const scrollDepthRef = useRef(0);

    const sendHeartbeat = useCallback(() => {
        const maxScroll = getMaxScrollDepth();
        if (maxScroll > scrollDepthRef.current) {
            scrollDepthRef.current = maxScroll;
        }
        elapsedRef.current += 30;
        const vitals = elapsedRef.current >= 60 ? getWebVitals() : { lcp: 0, cls: 0, inp: 0 };
        fetch('/api/analytics/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                path: pathname,
                seconds: 30,
                scrollDepth: scrollDepthRef.current,
                ...vitals,
            }),
            keepalive: true,
        }).catch(() => {});
    }, [pathname]);

    useEffect(() => {
        return () => {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const cleanupLinkTracking = trackExternalLinkClicks(pathname);
        return () => cleanupLinkTracking();
    }, [pathname]);

    useEffect(() => {
        if (viewSentRef.current) return;
        viewSentRef.current = true;
        elapsedRef.current = 0;
        scrollDepthRef.current = 0;

        const track = () => {
            const isNew = isNewSession();
            const isNewV = isNewVisitor();
            const pages = incrementSessionPages();
            const isReturning = !isNew && pages === 2;
            const prevPath = getPrevPath();
            const utm = parseUTM();

            fetch('/api/analytics/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: pathname,
                    prevPath,
                    referrer: document.referrer || '',
                    isNewSession: isNew,
                    isNewVisitor: isNewV,
                    isReturningSession: isReturning,
                    ...utm,
                }),
                keepalive: true,
            }).catch(() => {});

            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            heartbeatRef.current = setInterval(sendHeartbeat, 30000);
        };

        if (document.readyState === 'complete') {
            track();
        } else {
            window.addEventListener('load', track, { once: true });
        }
    }, [pathname, sendHeartbeat]);
}

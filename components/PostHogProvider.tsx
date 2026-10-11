'use client';

import { useEffect, type ReactNode } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

export function PostHogProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        const posthogHost =
            process.env.NEXT_PUBLIC_POSTHOG_HOST ||
            (process.env.NODE_ENV === 'development' ? 'https://us.i.posthog.com' : '/ingest');

        if (posthogKey && !posthog.__loaded) {
            posthog.init(posthogKey, {
                api_host: posthogHost,
                ui_host: 'https://us.posthog.com',
                person_profiles: 'always',
                capture_pageview: false, // Handled manually by PostHogPageView for accurate SPA route tracking
                capture_pageleave: true,
                autocapture: true,
                session_recording: {
                    recordCrossOriginIframes: true,
                },
            });
        }
    }, []);

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!posthogKey) {
        return <>{children}</>;
    }

    return <PHProvider client={posthog}>{children}</PHProvider>;
}

'use client';

'use client';

import type { ReactNode } from 'react';
import type { PostMeta } from '@/lib/types';
import ShellChrome from '@/components/ShellChrome';
import { useAnalytics } from '@/components/hooks/useAnalytics';
import '@/app/app.css';

interface ClientShellProps {
    children: ReactNode;
    posts: PostMeta[];
}

export default function ClientShell({ children, posts }: ClientShellProps) {
    useAnalytics();
    useAnalytics();
    return (
        <div className="app app-shell tui-window fade-in">
            <ShellChrome posts={posts} />

            <div className="main-layout app-shell__main">
                <main className="content-area">{children}</main>
            </div>
        </div>
    );
}

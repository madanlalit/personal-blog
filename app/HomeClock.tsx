'use client';

import { useEffect, useState } from 'react';

interface HomeClockProps {
    className?: string;
}

const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

export default function HomeClock({ className }: HomeClockProps) {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const update = () => setTime(formatTime(new Date()));
        update();

        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        let interval: ReturnType<typeof setInterval> | null = null;
        const timeout = setTimeout(() => {
            update();
            interval = setInterval(update, 60_000);
        }, msUntilNextMinute);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, []);

    return (
        <span className={className} suppressHydrationWarning>
            {time ?? '--:--'}
        </span>
    );
}

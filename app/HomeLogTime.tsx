'use client';

import { useState } from 'react';

interface HomeLogTimeProps {
    minuteOffset: number;
}

const formatLogTime = (date: Date) =>
    date.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

export default function HomeLogTime({ minuteOffset }: HomeLogTimeProps) {
    const [time] = useState(() => {
        const logTime = new Date();
        logTime.setMinutes(logTime.getMinutes() + minuteOffset);
        return formatLogTime(logTime);
    });

    return <span className="log-time" suppressHydrationWarning>[{time}]</span>;
}

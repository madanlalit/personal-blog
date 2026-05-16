import { NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/analytics';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get('days')) || 30));
    const format = url.searchParams.get('format');
    const stats = await getStats(days);

    if (format === 'csv') {
        const rows = [['date', 'pageviews', 'sessions'].join(',')];
        for (let i = 0; i < stats.dailyPageviews.length; i++) {
            rows.push([
                stats.dailyPageviews[i].date,
                stats.dailyPageviews[i].count,
                stats.dailySessions[i]?.count ?? 0,
            ].join(','));
        }
        return new NextResponse(rows.join('\n'), {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="analytics-${new Date().toISOString().slice(0, 10)}.csv"`,
                'Cache-Control': 'no-store',
            },
        });
    }

    return NextResponse.json(stats);
}

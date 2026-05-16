import { NextRequest, NextResponse } from 'next/server';
import { recordHeartbeat } from '@/lib/analytics';

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.path !== 'string') {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await recordHeartbeat(
        body.path,
        typeof body.seconds === 'number' ? Math.max(0, Math.round(body.seconds)) : 30,
        typeof body.scrollDepth === 'number' ? Math.max(0, Math.min(100, Math.round(body.scrollDepth))) : 0,
        typeof body.lcp === 'number' ? body.lcp : 0,
        typeof body.cls === 'number' ? body.cls : 0,
        typeof body.inp === 'number' ? body.inp : 0,
    );

    return NextResponse.json({ ok: true }, {
        headers: { 'Cache-Control': 'no-store' },
    });
}

import { NextRequest, NextResponse } from 'next/server';
import { recordEvent } from '@/lib/analytics';

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.name !== 'string' || typeof body.path !== 'string') {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const validEvents = ['external_link_click', 'code_copy', 'share_click', 'search_use', 'commander_open', 'mermaid_view'];
    if (!validEvents.includes(body.name)) {
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }

    await recordEvent(body.name, body.path);
    return NextResponse.json({ ok: true }, {
        headers: { 'Cache-Control': 'no-store' },
    });
}

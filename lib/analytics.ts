import { Redis } from '@upstash/redis';

function getRedis(): Redis | null {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }
    return new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
}

function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
    const l = ua.toLowerCase();
    let browser = 'Other';
    let os = 'Other';
    let device = 'Desktop';

    if (/edg/i.test(l)) browser = 'Edge';
    else if (/chrome|crios/i.test(l)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(l)) browser = 'Firefox';
    else if (/safari/i.test(l) && !/chrome|crios/i.test(l)) browser = 'Safari';
    else if (/opera|opr/i.test(l)) browser = 'Opera';

    if (/android/i.test(l)) { os = 'Android'; device = 'Mobile'; }
    else if (/ios|iphone|ipad|ipod/i.test(l)) { os = 'iOS'; device = /ipad/i.test(l) ? 'Tablet' : 'Mobile'; }
    else if (/mac/i.test(l)) os = 'macOS';
    else if (/windows/i.test(l)) os = 'Windows';
    else if (/linux/i.test(l) && !/android/i.test(l)) os = 'Linux';

    if (/tablet|ipad/i.test(l)) device = 'Tablet';
    return { browser, os, device };
}

function dayKey(date?: Date): string {
    const d = date ?? new Date();
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function expireDays(days: number): number {
    return 60 * 60 * 24 * days;
}

export interface PageViewEvent {
    path: string;
    prevPath: string;
    referrer: string;
    userAgent: string;
    timestamp: number;
    isNewSession: boolean;
    isNewVisitor: boolean;
    isReturningSession: boolean;
    country: string;
    region: string;
    city: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    utmContent: string;
}

export async function recordPageView(event: PageViewEvent): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    const day = dayKey();
    const pipeline = redis.pipeline();
    const ttl = expireDays(120);

    pipeline.incr('analytics:pageviews:total');
    pipeline.incr(`analytics:pageviews:date:${day}`);
    pipeline.incr(`analytics:pageviews:path:${event.path}`);
    pipeline.incr(`analytics:pageviews:date:${day}:path:${event.path}`);
    pipeline.expire(`analytics:pageviews:date:${day}`, ttl);
    pipeline.expire(`analytics:pageviews:date:${day}:path:${event.path}`, ttl);

    if (event.isNewSession) {
        pipeline.incr(`analytics:sessions:date:${day}`);
        pipeline.expire(`analytics:sessions:date:${day}`, ttl);

        if (event.isNewVisitor) {
            pipeline.incr(`analytics:visitors:new:date:${day}`);
            pipeline.expire(`analytics:visitors:new:date:${day}`, ttl);
        } else {
            pipeline.incr(`analytics:visitors:returning:date:${day}`);
            pipeline.expire(`analytics:visitors:returning:date:${day}`, ttl);
        }

        pipeline.zincrby('analytics:entry_pages', 1, event.path);

        if (event.referrer && !event.referrer.includes('lalitmadan.com')) {
            pipeline.zincrby(`analytics:referrers:${day}`, 1, event.referrer);
            pipeline.expire(`analytics:referrers:${day}`, ttl);
        }
    }

    if (event.isReturningSession) {
        pipeline.incr(`analytics:non_bounces:date:${day}`);
        pipeline.expire(`analytics:non_bounces:date:${day}`, ttl);
    }

    if (event.prevPath && event.path !== event.prevPath) {
        pipeline.zincrby(`analytics:flow:from:${event.prevPath}`, 1, event.path);
        pipeline.expire(`analytics:flow:from:${event.prevPath}`, ttl);
        pipeline.zincrby('analytics:exit_pages', 1, event.prevPath);
    }

    if (event.utmSource) {
        pipeline.zincrby('analytics:utm:sources', 1, event.utmSource);
        pipeline.zincrby(`analytics:utm:sources:${day}`, 1, event.utmSource);
        pipeline.expire(`analytics:utm:sources:${day}`, ttl);
    }
    if (event.utmMedium) {
        pipeline.zincrby('analytics:utm:mediums', 1, event.utmMedium);
    }
    if (event.utmCampaign) {
        pipeline.zincrby('analytics:utm:campaigns', 1, event.utmCampaign);
    }

    if (event.country) {
        pipeline.zincrby('analytics:countries', 1, event.country);
    }

    const { browser, os, device } = parseUserAgent(event.userAgent);
    pipeline.zincrby('analytics:browsers', 1, browser);
    pipeline.zincrby('analytics:oses', 1, os);
    pipeline.zincrby('analytics:devices', 1, device);

    await pipeline.exec();
}

export async function recordHeartbeat(
    path: string,
    seconds: number,
    scrollDepth: number,
    lcp: number,
    cls: number,
    inp: number
): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    const pipeline = redis.pipeline();

    if (seconds > 0) {
        pipeline.lpush(`analytics:time_on_page:path:${path}`, String(seconds));
        pipeline.ltrim(`analytics:time_on_page:path:${path}`, 0, 999);
        pipeline.incrby(`analytics:total_time:path:${path}`, seconds);
        pipeline.incrby('analytics:total_time', seconds);
        pipeline.incr(`analytics:heartbeats:path:${path}`);
        pipeline.expire(`analytics:time_on_page:path:${path}`, expireDays(120));
        pipeline.expire(`analytics:total_time:path:${path}`, expireDays(120));
    }

    if (scrollDepth > 0) {
        const bucket = scrollDepth <= 25 ? '0-25' : scrollDepth <= 50 ? '25-50' : scrollDepth <= 75 ? '50-75' : '75-100';
        pipeline.zincrby(`analytics:scroll_depth:${bucket}`, 1, path);
        pipeline.zincrby('analytics:scroll_depth:all', 1, bucket);
        pipeline.expire(`analytics:scroll_depth:${bucket}`, expireDays(120));
        pipeline.expire('analytics:scroll_depth:all', expireDays(120));
    }

    if (lcp > 0) {
        pipeline.lpush(`analytics:perf:LCP:path:${path}`, String(Math.round(lcp)));
        pipeline.ltrim(`analytics:perf:LCP:path:${path}`, 0, 99);
        pipeline.expire(`analytics:perf:LCP:path:${path}`, expireDays(120));
    }
    if (cls > 0) {
        pipeline.lpush(`analytics:perf:CLS:path:${path}`, String(cls.toFixed(4)));
        pipeline.ltrim(`analytics:perf:CLS:path:${path}`, 0, 99);
        pipeline.expire(`analytics:perf:CLS:path:${path}`, expireDays(120));
    }
    if (inp > 0) {
        pipeline.lpush(`analytics:perf:INP:path:${path}`, String(Math.round(inp)));
        pipeline.ltrim(`analytics:perf:INP:path:${path}`, 0, 99);
        pipeline.expire(`analytics:perf:INP:path:${path}`, expireDays(120));
    }

    await pipeline.exec();
}

export async function recordEvent(name: string, path: string): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    const day = dayKey();
    const pipeline = redis.pipeline();
    pipeline.incr('analytics:events:total');
    pipeline.incr(`analytics:events:name:${name}`);
    pipeline.incr(`analytics:events:date:${day}`);
    pipeline.incr(`analytics:events:date:${day}:name:${name}`);
    pipeline.incr(`analytics:events:path:${path}`);
    pipeline.expire(`analytics:events:date:${day}`, expireDays(120));
    pipeline.expire(`analytics:events:date:${day}:name:${name}`, expireDays(120));
    await pipeline.exec();
}

export interface AnalyticsStats {
    totalPageviews: number;
    todayPageviews: number;
    yesterdayPageviews: number;
    todaySessions: number;
    yesterdaySessions: number;
    todayNewVisitors: number;
    todayReturningVisitors: number;
    bounceRate: number;
    avgTimeOnPage: number;
    totalTime: number;
    totalEvents: number;
    todayEvents: number;
    dailyPageviews: Array<{ date: string; count: number }>;
    dailySessions: Array<{ date: string; count: number }>;
    topPaths: Array<{ path: string; count: number; avgTime: number; engagementScore: number }>;
    topEntryPages: Array<{ path: string; count: number }>;
    topExitPages: Array<{ path: string; count: number }>;
    topReferrers: Array<{ referrer: string; count: number }>;
    userFlows: Array<{ from: string; to: Array<{ path: string; count: number }> }>;
    countries: Array<{ country: string; count: number }>;
    browsers: Array<{ name: string; count: number }>;
    oses: Array<{ name: string; count: number }>;
    devices: Array<{ name: string; count: number }>;
    scrollDepth: Array<{ bucket: string; count: number }>;
    utmSources: Array<{ source: string; count: number }>;
    utmMediums: Array<{ medium: string; count: number }>;
    utmCampaigns: Array<{ campaign: string; count: number }>;
    webVitals: { lcp: number; cls: number; inp: number };
    events: Array<{ name: string; count: number }>;
}

function yesterdayKey(): string {
    return dayKey(new Date(Date.now() - 86400000));
}

async function avgTime(redis: Redis, path: string): Promise<number> {
    const totalTime = await redis.get<number>(`analytics:total_time:path:${path}`);
    const heartbeats = await redis.get<number>(`analytics:heartbeats:path:${path}`);
    if (!totalTime || !heartbeats || heartbeats === 0) return 0;
    return Math.round(totalTime / heartbeats);
}

async function zrangeToArray<T extends Record<string, unknown>>(
    redis: Redis,
    key: string,
    limit: number,
    mapper: (member: string, score: number) => T
): Promise<T[]> {
    const data = await redis.zrange<Array<{ member: string; score: number }>>(
        key, 0, limit - 1, { withScores: true, rev: true }
    );
    return (data ?? []).map((d) => mapper(d.member, d.score));
}

function avg(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export async function getStats(days = 30): Promise<AnalyticsStats> {
    const redis = getRedis();
    const empty: AnalyticsStats = {
        totalPageviews: 0, todayPageviews: 0, yesterdayPageviews: 0,
        todaySessions: 0, yesterdaySessions: 0,
        todayNewVisitors: 0, todayReturningVisitors: 0,
        bounceRate: 0, avgTimeOnPage: 0, totalTime: 0,
        totalEvents: 0, todayEvents: 0,
        dailyPageviews: [], dailySessions: [], topPaths: [],
        topEntryPages: [], topExitPages: [], topReferrers: [],
        userFlows: [], countries: [], browsers: [], oses: [], devices: [],
        scrollDepth: [], utmSources: [], utmMediums: [], utmCampaigns: [],
        webVitals: { lcp: 0, cls: 0, inp: 0 },
        events: [],
    };
    if (!redis) return empty;

    const day = dayKey();
    const yday = yesterdayKey();

    const [
        total, todayViews, yesterdayViews, todaySessions, yesterdaySessions,
        todayNonBounces, todayNewVisitors, todayReturningVisitors,
        totalTime, totalEvents, todayEventsCount,
    ] = await Promise.all([
        redis.get<number>('analytics:pageviews:total'),
        redis.get<number>(`analytics:pageviews:date:${day}`),
        redis.get<number>(`analytics:pageviews:date:${yday}`),
        redis.get<number>(`analytics:sessions:date:${day}`),
        redis.get<number>(`analytics:sessions:date:${yday}`),
        redis.get<number>(`analytics:non_bounces:date:${day}`),
        redis.get<number>(`analytics:visitors:new:date:${day}`),
        redis.get<number>(`analytics:visitors:returning:date:${day}`),
        redis.get<number>('analytics:total_time'),
        redis.get<number>('analytics:events:total'),
        redis.get<number>(`analytics:events:date:${day}`),
    ]);

    const todayS = todaySessions ?? 0;
    const todayNB = todayNonBounces ?? 0;
    const bounceRate = todayS > 0 ? Math.round(((todayS - todayNB) / todayS) * 100) : 0;

    const dateKeys: string[] = [];
    const d = new Date();
    for (let i = 0; i < days; i++) {
        dateKeys.push(dayKey(new Date(d.getTime() - i * 86400000)));
    }

    const [dailyCounts, dailySessionCounts] = await Promise.all([
        Promise.all(dateKeys.map((key) => redis.get<number>(`analytics:pageviews:date:${key}`))),
        Promise.all(dateKeys.map((key) => redis.get<number>(`analytics:sessions:date:${key}`))),
    ]);

    const dailyPageviews = dateKeys.map((date, i) => ({ date, count: dailyCounts[i] ?? 0 })).reverse();
    const dailySessions = dateKeys.map((date, i) => ({ date, count: dailySessionCounts[i] ?? 0 })).reverse();

    const pathKeys = await redis.keys('analytics:pageviews:path:*');
    let topPaths: AnalyticsStats['topPaths'] = [];
    if (pathKeys.length > 0) {
        const pathCounts = await redis.mget<number[]>(...pathKeys);
        const pathsWithCounts = pathKeys.map((key, i) => ({
            rawPath: key.replace('analytics:pageviews:path:', ''),
            count: pathCounts[i] ?? 0,
        }));
        pathsWithCounts.sort((a, b) => b.count - a.count);
        const top15 = pathsWithCounts.slice(0, 15);
        const times = await Promise.all(top15.map((p) => avgTime(redis, p.rawPath)));
        topPaths = top15.map((p, i) => {
            const timeFactor = Math.min(times[i] / 120, 1);
            const engagementScore = Math.round((p.count * 0.4 + timeFactor * 40 + (p.count > 0 ? 20 : 0)));
            return { path: p.rawPath, count: p.count, avgTime: times[i], engagementScore };
        });
    }

    const [
        topReferrers, entryPages, exitPages, countries, browsers, oses, devices,
        scrollDepth, utmSources, utmMediums, utmCampaigns, eventsData,
    ] = await Promise.all([
        zrangeToArray(redis, `analytics:referrers:${day}`, 10, (referrer, count) => ({ referrer, count })),
        zrangeToArray(redis, 'analytics:entry_pages', 20, (path, count) => ({ path, count })),
        zrangeToArray(redis, 'analytics:exit_pages', 20, (path, count) => ({ path, count })),
        zrangeToArray(redis, 'analytics:countries', 20, (country, count) => ({ country, count })),
        zrangeToArray(redis, 'analytics:browsers', 10, (name, count) => ({ name, count })),
        zrangeToArray(redis, 'analytics:oses', 10, (name, count) => ({ name, count })),
        zrangeToArray(redis, 'analytics:devices', 5, (name, count) => ({ name, count })),
        zrangeToArray(redis, 'analytics:scroll_depth:all', 4, (bucket, count) => ({ bucket, count })),
        zrangeToArray(redis, 'analytics:utm:sources', 10, (source, count) => ({ source, count })),
        zrangeToArray(redis, 'analytics:utm:mediums', 10, (medium, count) => ({ medium, count })),
        zrangeToArray(redis, 'analytics:utm:campaigns', 10, (campaign, count) => ({ campaign, count })),
        Promise.all([redis.keys('analytics:events:name:*').then(async (keys) => {
            if (keys.length === 0) return [];
            const counts = await redis.mget<number[]>(...keys);
            return keys
                .map((k, i) => ({ name: k.replace('analytics:events:name:', ''), count: counts[i] ?? 0 }))
                .sort((a, b) => b.count - a.count);
        })]),
    ]);

    const userFlows: AnalyticsStats['userFlows'] = [];
    if (entryPages.length > 0) {
        const topEntries = entryPages.slice(0, 5);
        for (const entry of topEntries) {
            const flows = await redis.zrange<Array<{ member: string; score: number }>>(
                `analytics:flow:from:${entry.path}`, 0, 4, { withScores: true, rev: true }
            );
            if (flows && flows.length > 0) {
                userFlows.push({
                    from: entry.path,
                    to: flows.map((f) => ({ path: f.member, count: f.score })),
                });
            }
        }
    }

    const perfPath = topPaths.length > 0 ? topPaths[0].path : '/';
    const [lcpVals, clsVals, inpVals] = await Promise.all([
        redis.lrange(`analytics:perf:LCP:path:${perfPath}`, 0, -1),
        redis.lrange(`analytics:perf:CLS:path:${perfPath}`, 0, -1),
        redis.lrange(`analytics:perf:INP:path:${perfPath}`, 0, -1),
    ]);

    const webVitals = {
        lcp: avg((lcpVals ?? []).map(Number)),
        cls: parseFloat(avg((clsVals ?? []).map(Number)).toFixed(3)) / 1000 || 0,
        inp: avg((inpVals ?? []).map(Number)),
    };

    const avgTimeOnPage = (await Promise.all(
        pathKeys.slice(0, 10).map((k) => avgTime(redis, k.replace('analytics:pageviews:path:', '')))
    )).reduce((a, b) => a + b, 0) / Math.min(10, pathKeys.length);

    return {
        totalPageviews: total ?? 0,
        todayPageviews: todayViews ?? 0,
        yesterdayPageviews: yesterdayViews ?? 0,
        todaySessions: todayS,
        yesterdaySessions: yesterdaySessions ?? 0,
        todayNewVisitors: todayNewVisitors ?? 0,
        todayReturningVisitors: todayReturningVisitors ?? 0,
        bounceRate,
        avgTimeOnPage: Math.round(avgTimeOnPage) || 0,
        totalTime: totalTime ?? 0,
        totalEvents: totalEvents ?? 0,
        todayEvents: todayEventsCount ?? 0,
        dailyPageviews,
        dailySessions,
        topPaths,
        topEntryPages: entryPages,
        topExitPages: exitPages,
        topReferrers,
        userFlows,
        countries,
        browsers,
        oses,
        devices,
        scrollDepth,
        utmSources,
        utmMediums,
        utmCampaigns,
        webVitals,
        events: eventsData[0] ?? [],
    };
}

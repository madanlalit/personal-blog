'use client';

import { useEffect, useState, useCallback } from 'react';
import type { AnalyticsStats } from '@/lib/analytics';

const DATE_RANGES = [
    { label: '7d', days: 7 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
];

function formatTime(s: number): string {
    if (!s || s < 60) return `${s || 0}s`;
    if (s < 3600) return `${Math.round(s / 60)}m ${s % 60}s`;
    return `${Math.floor(s / 3600)}h ${Math.round((s % 3600) / 60)}m`;
}

function formatCount(n: number): string {
    if (n == null || isNaN(n)) return '0';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
}

function pctChange(current: number, previous: number): { pct: number; up: boolean } {
    if (current == null || previous == null) return { pct: 0, up: false };
    const pct = Math.round(((current - previous) / previous) * 100);
    return { pct: Math.abs(pct), up: pct >= 0 };
}

function StatCard({ label, value, previous, format }: {
    label: string;
    value: number;
    previous?: number;
    format?: 'time' | 'pct';
}) {
    const val = value ?? 0;
    const change = previous !== undefined ? pctChange(val, previous) : null;
    const display = format === 'time' ? formatTime(val) : format === 'pct' ? `${val}%` : val.toLocaleString();

    return (
        <div className="tui-card stat-card">
            <span className="stat-value">{display}</span>
            <span className="stat-label">
                {label}
                {change && val > 0 && (
                    <span className={`stat-change ${change.up ? 'up' : 'down'}`}>
                        {change.up ? '↑' : '↓'} {change.pct}%
                    </span>
                )}
            </span>
        </div>
    );
}

function AreaChart({ data, height = 160, label }: {
    data: Array<{ date: string; count: number }>;
    height?: number;
    label: string;
}) {
    const width = 700;
    const pad = { top: 20, right: 16, bottom: 22, left: 16 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;
    const max = Math.max(1, ...data.map((d) => d.count));

    if (data.length < 2) {
        return (
            <div className="tui-card analytics-section">
                <h3>{label}</h3>
                <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
                    <text x={width / 2} y={height / 2} textAnchor="middle" fill="var(--text-secondary)" fontSize="12">No data yet</text>
                </svg>
            </div>
        );
    }

    const pathData = data.map((d, i) => {
        const x = pad.left + (i / (data.length - 1)) * cw;
        const y = pad.top + ch - (d.count / max) * ch;
        return `${x},${y}`;
    });

    const linePath = pathData.join(' ');
    const areaPath = `${linePath} ${pad.left + cw},${pad.top + ch} ${pad.left},${pad.top + ch}`;

    const xLabels: { x: number; label: string }[] = [];
    const step = Math.max(1, Math.floor(data.length / 5));
    for (let i = 0; i < data.length; i += step) {
        xLabels.push({
            x: pad.left + (i / (data.length - 1)) * cw,
            label: data[i].date.slice(5),
        });
    }

    const yTicks = 4;
    const yLabels: { y: number; label: string }[] = [];
    for (let i = 0; i <= yTicks; i++) {
        const val = Math.round((max / yTicks) * (yTicks - i));
        yLabels.push({
            y: pad.top + (ch / yTicks) * i,
            label: formatCount(val),
        });
    }

    return (
        <div className="tui-card analytics-section">
            <h3>{label}</h3>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ maxWidth: width }}>
                <defs>
                    <linearGradient id={`${label.replace(/\s/g, '')}Grad`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                {yLabels.map((yl) => (
                    <g key={yl.y}>
                        <line x1={pad.left} y1={yl.y} x2={pad.left + cw} y2={yl.y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <text x={pad.left - 4} y={yl.y + 4} textAnchor="end" fill="var(--text-tertiary)" fontSize="10">{yl.label}</text>
                    </g>
                ))}
                <polygon points={areaPath} fill={`url(#${label.replace(/\s/g, '')}Grad)`} />
                <polyline points={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {xLabels.map((xl) => (
                    <text key={xl.x} x={xl.x} y={height - 6} textAnchor="middle" fill="var(--text-secondary)" fontSize="10">{xl.label}</text>
                ))}
                <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + ch} stroke="var(--border)" strokeWidth="1" />
                <line x1={pad.left} y1={pad.top + ch} x2={pad.left + cw} y2={pad.top + ch} stroke="var(--border)" strokeWidth="1" />
            </svg>
        </div>
    );
}

function BarChart({ data, label, formatValue }: {
    data: Array<{ label: string; count: number; extra?: string }>;
    label: string;
    formatValue?: (v: number) => string;
}) {
    const max = Math.max(1, ...data.map((d) => d.count));
    const fmt = formatValue ?? formatCount;

    return (
        <div className="tui-card analytics-section">
            <h3>{label}</h3>
            {data.length === 0 ? (
                <p className="muted" style={{ fontSize: '0.75rem' }}>No data yet</p>
            ) : (
                <div className="analytics-bar-list">
                    {data.map((item) => (
                        <div key={item.label} className="analytics-bar-row">
                            <span className="analytics-bar-label" title={item.label}>{item.label}</span>
                            <div className="analytics-bar-track">
                                <div
                                    className="analytics-bar-fill"
                                    style={{ width: `${(item.count / max) * 100}%` }}
                                />
                            </div>
                            <span className="analytics-bar-count">
                                {fmt(item.count)}
                                {item.extra && <span className="analytics-bar-extra">{item.extra}</span>}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function UserFlows({ flows }: { flows: AnalyticsStats['userFlows'] }) {
    if (flows.length === 0) return null;
    return (
        <div className="tui-card analytics-section">
            <h3>User Flows</h3>
            <div className="flows-list">
                {flows.map((flow) => (
                    <div key={flow.from} className="flow-item">
                        <div className="flow-from">
                            <a href={flow.from}>{flow.from}</a>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-tos">
                            {flow.to.map((dest) => (
                                <span key={dest.path} className="flow-to">
                                    <a href={dest.path}>{dest.path}</a>
                                    <span className="flow-count">{dest.count}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TableData({ data, col1, col2, formatValue }: {
    data: Array<{ label: string; count: number }>;
    col1: string;
    col2: string;
    formatValue?: (v: number) => string;
}) {
    if (data.length === 0) return null;
    const fmt = formatValue ?? ((v: number) => (v ?? 0).toLocaleString());
    return (
        <table className="analytics-table">
            <thead>
                <tr>
                    <th>{col1}</th>
                    <th className="num">{col2}</th>
                </tr>
            </thead>
            <tbody>
                {data.map((r) => (
                    <tr key={r.label}>
                        <td className="truncate">{r.label}</td>
                        <td className="num">{fmt(r.count)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function AnalyticsClient() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState(30);
    const [exporting, setExporting] = useState(false);

    const fetchStats = useCallback((d: number) => {
        let cancelled = false;
        fetch(`/api/analytics/stats?days=${d}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setStats(data);
                    setError(null);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError('Analytics not configured. Create an Upstash Redis database from your Vercel Storage tab.');
                }
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        return fetchStats(days);
    }, [days, fetchStats]);

    const handleExport = () => {
        setExporting(true);
        const a = document.createElement('a');
        a.href = `/api/analytics/stats?days=${days}&format=csv`;
        a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        setTimeout(() => setExporting(false), 1000);
    };

    if (error) {
        return (
            <div className="analytics-page">
                <div className="analytics-header">
                    <h1>Analytics</h1>
                </div>
                <div className="tui-card">
                    <p className="muted">{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="analytics-page">
                <div className="analytics-header">
                    <h1>Analytics</h1>
                </div>
                <div className="analytics-loading">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="tui-card skeleton" style={{ height: 120 }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h1>Analytics</h1>
                <div className="analytics-controls">
                    <div className="analytics-date-picker">
                        {DATE_RANGES.map((r) => (
                            <button
                                key={r.days}
                                className={`tui-btn ${days === r.days ? 'tui-btn--active' : ''}`}
                                onClick={() => setDays(r.days)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <button className="tui-btn" onClick={handleExport} disabled={exporting}>
                        {exporting ? 'Exporting…' : 'CSV ↓'}
                    </button>
                </div>
            </div>

            <p className="subtitle">
                Privacy-first · No cookies · No third parties ·{' '}
                                {(stats.totalPageviews ?? 0).toLocaleString()} total page views
            </p>

            {/* Key Metrics */}
            <div className="analytics-grid metrics-grid">
                <StatCard label="Page Views Today" value={stats.todayPageviews} previous={stats.yesterdayPageviews} />
                <StatCard label="Sessions Today" value={stats.todaySessions} previous={stats.yesterdaySessions} />
                <StatCard label="Bounce Rate" value={stats.bounceRate} format="pct" />
                <StatCard label="Avg Time on Page" value={stats.avgTimeOnPage} format="time" />
                <StatCard label="Total Events (All-Time)" value={stats.totalEvents} />
                <StatCard label="Total Engagement" value={stats.totalTime} format="time" />
                <StatCard label="Events Today" value={stats.todayEvents} />
                <StatCard label="All-Time Views" value={stats.totalPageviews} />
            </div>

            {/* New vs Returning */}
            <div className="analytics-grid two-col">
                <div className="tui-card analytics-section">
                    <h3>Visitors Today</h3>
                    <div className="analytics-bar-list">
                        <div className="analytics-bar-row">
                            <span className="analytics-bar-label">New</span>
                            <div className="analytics-bar-track">
                                <div className="analytics-bar-fill analytics-bar-fill--accent2"
                                    style={{ width: `${stats.todayNewVisitors / Math.max(1, stats.todayNewVisitors + stats.todayReturningVisitors) * 100}%` }} />
                            </div>
                            <span className="analytics-bar-count">{stats.todayNewVisitors}</span>
                        </div>
                        <div className="analytics-bar-row">
                            <span className="analytics-bar-label">Returning</span>
                            <div className="analytics-bar-track">
                                <div className="analytics-bar-fill"
                                    style={{ width: `${stats.todayReturningVisitors / Math.max(1, stats.todayNewVisitors + stats.todayReturningVisitors) * 100}%` }} />
                            </div>
                            <span className="analytics-bar-count">{stats.todayReturningVisitors}</span>
                        </div>
                    </div>
                </div>

                {/* Web Vitals */}
                <div className="tui-card analytics-section">
                    <h3>Core Web Vitals</h3>
                    <div className="vitals-grid">
                        <div className="vital-item">
                            <span className="vital-value" style={{ color: stats.webVitals.lcp < 2500 ? 'var(--accent)' : '#C5A3A3' }}>
                                {stats.webVitals.lcp > 0 ? `${stats.webVitals.lcp}ms` : '—'}
                            </span>
                            <span className="vital-label">LCP</span>
                        </div>
                        <div className="vital-item">
                            <span className="vital-value" style={{ color: stats.webVitals.cls < 0.1 ? 'var(--accent)' : '#C5A3A3' }}>
                                {stats.webVitals.cls > 0 ? stats.webVitals.cls.toFixed(3) : '—'}
                            </span>
                            <span className="vital-label">CLS</span>
                        </div>
                        <div className="vital-item">
                            <span className="vital-value" style={{ color: stats.webVitals.inp < 200 ? 'var(--accent)' : '#C5A3A3' }}>
                                {stats.webVitals.inp > 0 ? `${stats.webVitals.inp}ms` : '—'}
                            </span>
                            <span className="vital-label">INP</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <AreaChart data={stats.dailyPageviews} label="Page Views" height={180} />
            <AreaChart data={stats.dailySessions} label="Sessions" height={180} />

            {/* Content Engagement */}
            {stats.topPaths.length > 0 && (
                <BarChart
                    data={stats.topPaths.map((p) => ({
                        label: p.path,
                        count: p.count,
                        extra: ` · ${formatTime(p.avgTime)} · Score ${p.engagementScore}`,
                    }))}
                    label="Content Engagement"
                    formatValue={(v) => (v ?? 0).toLocaleString()}
                />
            )}

            {/* User Flows */}
            <UserFlows flows={stats.userFlows} />

            {/* Entry / Exit Pages */}
            <div className="analytics-grid two-col">
                {stats.topEntryPages.length > 0 && (
                    <div className="tui-card analytics-section">
                        <h3>Top Entry Pages</h3>
                        <TableData
                            data={stats.topEntryPages.slice(0, 10).map((p) => ({ label: p.path, count: p.count }))}
                            col1="Page"
                            col2="Entries"
                        />
                    </div>
                )}
                {stats.topExitPages.length > 0 && (
                    <div className="tui-card analytics-section">
                        <h3>Top Exit Pages</h3>
                        <TableData
                            data={stats.topExitPages.slice(0, 10).map((p) => ({ label: p.path, count: p.count }))}
                            col1="Page"
                            col2="Exits"
                        />
                    </div>
                )}
            </div>

            {/* Breakdowns grid */}
            <div className="analytics-grid two-col">
                {stats.countries.length > 0 && (
                    <BarChart
                        data={stats.countries.map((c) => ({ label: c.country || 'Unknown', count: c.count }))}
                        label="Countries"
                    />
                )}
                {stats.devices.length > 0 && (
                    <BarChart
                        data={stats.devices.map((d) => ({ label: d.name, count: d.count }))}
                        label="Devices"
                    />
                )}
                {stats.browsers.length > 0 && (
                    <BarChart
                        data={stats.browsers.map((b) => ({ label: b.name, count: b.count }))}
                        label="Browsers"
                    />
                )}
                {stats.oses.length > 0 && (
                    <BarChart
                        data={stats.oses.map((o) => ({ label: o.name, count: o.count }))}
                        label="Operating Systems"
                    />
                )}
                {stats.scrollDepth.length > 0 && (
                    <BarChart
                        data={stats.scrollDepth.map((s) => ({ label: `${s.bucket}%`, count: s.count }))}
                        label="Scroll Depth"
                    />
                )}
                {stats.topReferrers.length > 0 && (
                    <div className="tui-card analytics-section">
                        <h3>Today&apos;s Referrers</h3>
                            <TableData
                                data={stats.topReferrers.map((r) => ({
                                    label: r.referrer.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 50),
                                    count: r.count,
                                }))}
                                col1="Source"
                            col2="Views"
                        />
                    </div>
                )}
            </div>

            {/* UTM / Campaigns */}
            {(stats.utmSources.length > 0 || stats.utmMediums.length > 0 || stats.utmCampaigns.length > 0) && (
                <div className="analytics-grid three-col utm-section">
                    {stats.utmSources.length > 0 && (
                        <div className="tui-card analytics-section">
                            <h3>UTM Sources</h3>
                            <TableData data={stats.utmSources.map((s) => ({ label: s.source, count: s.count }))} col1="Source" col2="Visits" />
                        </div>
                    )}
                    {stats.utmMediums.length > 0 && (
                        <div className="tui-card analytics-section">
                            <h3>UTM Mediums</h3>
                            <TableData data={stats.utmMediums.map((m) => ({ label: m.medium, count: m.count }))} col1="Medium" col2="Visits" />
                        </div>
                    )}
                    {stats.utmCampaigns.length > 0 && (
                        <div className="tui-card analytics-section">
                            <h3>UTM Campaigns</h3>
                            <TableData data={stats.utmCampaigns.map((c) => ({ label: c.campaign, count: c.count }))} col1="Campaign" col2="Visits" />
                        </div>
                    )}
                </div>
            )}

            {/* Custom Events */}
            {stats.events.length > 0 && (
                <BarChart
                    data={stats.events.map((e) => ({
                        label: e.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                        count: e.count,
                    }))}
                    label="Custom Events"
                />
            )}

        </div>
    );
}

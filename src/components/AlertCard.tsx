'use client';

import { Alert, Severity } from '@/hooks/useAlerts';

const severityConfig: Record<Severity, { color: string; dim: string; label: string; icon: string }> = {
    critical: { color: 'var(--red)', dim: 'var(--red-dim)', label: 'CRÍTICO', icon: '⚠' },
    warning: { color: 'var(--orange)', dim: 'var(--orange-dim)', label: 'ADVERTENCIA', icon: '△' },
    info: { color: 'var(--blue)', dim: 'var(--blue-dim)', label: 'INFO', icon: 'ℹ' },
    resolved: { color: 'var(--green)', dim: 'var(--green-dim)', label: 'RESUELTO', icon: '✓' },
};

function timeAgo(date: Date): string {
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 60) return `hace ${s}s`;
    if (s < 3600) return `hace ${Math.floor(s / 60)}m`;
    return `hace ${Math.floor(s / 3600)}h`;
}

interface AlertCardProps {
    alert: Alert;
    onResolve: (id: string) => void;
}

export default function AlertCard({ alert, onResolve }: AlertCardProps) {
    const cfg = severityConfig[alert.severity];

    return (
        <div
            className={`rounded-2xl p-6 transition-all ${alert.isNew ? 'animate-slide-in' : ''} ${alert.severity === 'critical' && alert.isNew ? 'animate-shake' : ''}`}
            style={{
                background: 'var(--bg-card)',
                border: `1px solid ${alert.severity === 'critical' ? cfg.color + '44' : 'var(--border)'}`,
            }}
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-4 min-w-0">
                    <span
                        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: cfg.dim, color: cfg.color }}
                    >
                        {cfg.icon}
                    </span>
                    <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--text)] truncate">{alert.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md" style={{ background: cfg.dim, color: cfg.color }}>
                                {cfg.label}
                            </span>
                            <span className="text-xs text-[var(--text-3)]">{alert.zone}</span>
                        </div>
                    </div>
                </div>
                <span className="text-xs text-[var(--text-3)] flex-shrink-0 mt-1 mono">{timeAgo(alert.timestamp)}</span>
            </div>

            {/* Description */}
            <p className="text-base text-[var(--text-2)] leading-relaxed mb-5">{alert.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-3)]">{alert.source}</span>
                {alert.severity !== 'resolved' && (
                    <button
                        onClick={() => onResolve(alert.id)}
                        className="text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        style={{ background: 'var(--green-dim)', color: 'var(--green)' }}
                    >
                        Resolver
                    </button>
                )}
            </div>
        </div>
    );
}

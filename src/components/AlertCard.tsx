'use client';

import { Alert, Severity } from '@/hooks/useAlerts';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { ComponentType } from 'react';

const severityConfig: Record<Severity, {
    color: string;
    dim: string;
    label: string;
    Icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
}> = {
    critical: { color: 'var(--red)', dim: 'var(--red-dim)', label: 'CRÍTICO', Icon: AlertTriangle },
    warning: { color: 'var(--orange)', dim: 'var(--orange-dim)', label: 'ADVERTENCIA', Icon: AlertCircle },
    info: { color: 'var(--blue)', dim: 'var(--blue-dim)', label: 'INFO', Icon: Info },
    resolved: { color: 'var(--green)', dim: 'var(--green-dim)', label: 'RESUELTO', Icon: CheckCircle },
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
    const { Icon } = cfg;
    const isCritical = alert.severity === 'critical';

    return (
        <div
            className={`card transition-all ${alert.isNew ? 'animate-slide-in' : ''} ${isCritical && alert.isNew ? 'animate-shake' : ''}`}
            style={{
                padding: '20px 24px',
                borderLeft: `3px solid ${cfg.color}`,
                ...(isCritical
                    ? {
                        animation: 'border-glow 2s ease-in-out infinite',
                        boxShadow: 'var(--shadow-card), 0 0 16px rgba(255,77,106,0.08)',
                    }
                    : {}),
            }}
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <span
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: cfg.dim,
                            border: `1px solid ${cfg.color}20`,
                        }}
                    >
                        <Icon size={18} style={{ color: cfg.color }} />
                    </span>
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold truncate" style={{ color: 'var(--text)' }}>
                            {alert.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                                style={{ background: cfg.dim, color: cfg.color }}
                            >
                                {cfg.label}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-3)' }}>{alert.zone}</span>
                        </div>
                    </div>
                </div>
                <span className="text-[11px] flex-shrink-0 mt-1 mono" style={{ color: 'var(--text-3)' }}>
                    {timeAgo(alert.timestamp)}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>
                {alert.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>{alert.source}</span>
                {alert.severity !== 'resolved' && (
                    <button
                        onClick={() => onResolve(alert.id)}
                        className="text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                        style={{
                            background: 'var(--green-dim)',
                            color: 'var(--green)',
                            border: '1px solid rgba(0,214,143,0.15)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0,214,143,0.2)';
                            e.currentTarget.style.borderColor = 'rgba(0,214,143,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--green-dim)';
                            e.currentTarget.style.borderColor = 'rgba(0,214,143,0.15)';
                        }}
                    >
                        ✓ Resolver
                    </button>
                )}
            </div>
        </div>
    );
}

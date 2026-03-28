'use client';

import { Activity, AlertTriangle, Bell, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';

interface StatusHeaderProps {
    connected: boolean | null;
    stats: {
        total: number;
        critical: number;
        warning: number;
        resolved: number;
    };
    lastQueried: string | null;
    sirenActive: boolean;
}

export default function StatusHeader({ connected, stats, lastQueried, sirenActive }: StatusHeaderProps) {
    return (
        <header className="card px-6 py-4" style={{ borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle gradient accent on top */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: connected === true
                        ? 'linear-gradient(90deg, var(--green), var(--cyan), var(--blue))'
                        : 'linear-gradient(90deg, var(--red), var(--orange))',
                }}
            />

            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Left — branding */}
                <div className="flex items-center gap-4">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                            background: sirenActive ? 'var(--red-dim)' : 'linear-gradient(135deg, rgba(0,214,143,0.15), rgba(84,160,255,0.15))',
                            border: '1px solid ' + (sirenActive ? 'rgba(255,77,106,0.3)' : 'rgba(0,214,143,0.15)'),
                        }}
                    >
                        <Activity size={20} style={{ color: sirenActive ? 'var(--red)' : 'var(--green)' }} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                            CanSat Control Center
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            {connected === true ? (
                                <Wifi size={13} style={{ color: 'var(--green)' }} />
                            ) : (
                                <WifiOff size={13} style={{ color: connected === false ? 'var(--red)' : 'var(--text-3)' }} />
                            )}
                            <span className="text-xs" style={{ color: connected === true ? 'var(--green)' : connected === false ? 'var(--red)' : 'var(--text-3)' }}>
                                {connected === true ? 'Conectado a InfluxDB' : connected === false ? 'Sin conexión' : 'Conectando...'}
                            </span>
                            {connected === true && (
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: 'var(--green)',
                                        animation: 'pulse-dot 2s ease-in-out infinite',
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Center — alert counters */}
                <div className="flex items-center gap-2">
                    {[
                        { label: 'Crítico', value: stats.critical, color: 'var(--red)', dim: 'var(--red-dim)', Icon: AlertTriangle },
                        { label: 'Advertencia', value: stats.warning, color: 'var(--orange)', dim: 'var(--orange-dim)', Icon: Bell },
                        { label: 'Resuelto', value: stats.resolved, color: 'var(--green)', dim: 'var(--green-dim)', Icon: CheckCircle },
                    ].map(({ label, value, color, dim, Icon }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                            style={{
                                background: dim,
                                border: `1px solid ${color}18`,
                            }}
                        >
                            <Icon size={13} style={{ color }} />
                            <span className="mono text-sm font-bold" style={{ color }}>{value}</span>
                            <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-3)' }}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Right — timestamp */}
                <div className="flex items-center gap-2" style={{ color: 'var(--text-3)' }}>
                    <Clock size={13} />
                    <span className="text-xs mono">
                        {lastQueried
                            ? new Date(lastQueried).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })
                            : '--:--:--'}
                    </span>
                </div>
            </div>
        </header>
    );
}

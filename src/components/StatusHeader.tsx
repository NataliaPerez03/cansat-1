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
        <header className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 relative overflow-hidden">
            {/* Subtle gradient accent on top */}
            <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{
                    background: connected === true
                        ? 'linear-gradient(90deg, #10B981, #06B6D4, #3B82F6)' // Emerald -> Cyan -> Blue
                        : 'linear-gradient(90deg, #EF4444, #F97316)', // Red -> Orange
                }}
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mt-1">

                {/* Left — branding */}
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${sirenActive
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-blue-50 text-blue-600 border-blue-200'
                            }`}
                    >
                        <Activity size={24} />
                    </div>

                    <div>
                        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                            CanSat Control Center
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            {connected === true ? (
                                <Wifi size={14} className="text-emerald-500" />
                            ) : (
                                <WifiOff size={14} className={connected === false ? 'text-red-500' : 'text-slate-400'} />
                            )}

                            <span className={`text-xs font-bold uppercase tracking-wider ${connected === true ? 'text-emerald-600' : connected === false ? 'text-red-600' : 'text-slate-500'
                                }`}>
                                {connected === true ? 'Conectado a InfluxDB' : connected === false ? 'Sin conexión' : 'Conectando...'}
                            </span>

                            {connected === true && (
                                <span
                                    className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"
                                    style={{
                                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Center/Right — alert counters and timestamp */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full md:w-auto">

                    {/* Counters */}
                    <div className="flex items-center gap-2.5">
                        {[
                            { label: 'Crítico', value: stats.critical, colorClass: 'text-red-600', bgClass: 'bg-red-50', borderClass: 'border-red-200', Icon: AlertTriangle },
                            { label: 'Advertencia', value: stats.warning, colorClass: 'text-amber-600', bgClass: 'bg-amber-50', borderClass: 'border-amber-200', Icon: Bell },
                            { label: 'Resuelto', value: stats.resolved, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200', Icon: CheckCircle },
                        ].map(({ label, value, colorClass, bgClass, borderClass, Icon }) => (
                            <div
                                key={label}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border ${bgClass} ${borderClass} shadow-sm`}
                            >
                                <Icon size={14} className={colorClass} />
                                <span className={`font-mono text-sm font-black ${colorClass}`}>
                                    {value}
                                </span>
                                <span className="text-[11px] font-bold text-slate-600 hidden lg:inline uppercase tracking-widest">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Divider hidden on small screens */}
                    <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-xs font-bold font-mono text-slate-600">
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
            </div>
        </header>
    );
}
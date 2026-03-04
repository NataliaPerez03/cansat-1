'use client';

import { Alert } from '@/hooks/useAlerts';

interface NeighborhoodMapProps {
    alerts: Alert[];
}

const zones = [
    { id: 'Zona A', path: 'M 10 10 L 48 10 L 48 35 L 10 35 Z', cx: 29, cy: 22 },
    { id: 'Zona B', path: 'M 52 10 L 90 10 L 90 35 L 52 35 Z', cx: 71, cy: 22 },
    { id: 'Bloque A', path: 'M 10 39 L 30 39 L 30 58 L 10 58 Z', cx: 20, cy: 48 },
    { id: 'Bloque B', path: 'M 34 39 L 66 39 L 66 58 L 34 58 Z', cx: 50, cy: 48 },
    { id: 'Bloque C', path: 'M 70 39 L 90 39 L 90 58 L 70 58 Z', cx: 80, cy: 48 },
    { id: 'Zona C', path: 'M 10 62 L 48 62 L 48 90 L 10 90 Z', cx: 29, cy: 76 },
    { id: 'Zona D', path: 'M 52 62 L 90 62 L 90 90 L 52 90 Z', cx: 71, cy: 76 },
    { id: 'Parque', path: 'M 35 28 L 65 28 L 65 42 L 35 42 Z', cx: 50, cy: 35 },
];

export default function NeighborhoodMap({ alerts }: NeighborhoodMapProps) {
    const activeAlerts = alerts.filter((a) => a.severity !== 'resolved');

    function getZoneSeverity(zoneId: string): string | null {
        const zoneAlerts = activeAlerts.filter((a) => a.zone === zoneId || a.zone === 'Todas las Zonas' || a.zone === 'Sensor Network' || a.zone === 'Mi Zona');
        if (zoneAlerts.some((a) => a.severity === 'critical')) return 'var(--red)';
        if (zoneAlerts.some((a) => a.severity === 'warning')) return 'var(--orange)';
        if (zoneAlerts.length > 0) return 'var(--blue)';
        return null;
    }

    function getZoneAlertCount(zoneId: string): number {
        return activeAlerts.filter((a) => a.zone === zoneId || a.zone === 'Todas las Zonas' || a.zone === 'Sensor Network' || a.zone === 'Mi Zona').length;
    }

    return (
        <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-sm text-[var(--text-3)] tracking-wide uppercase font-semibold">Mapa del Vecindario</h2>
                <span className="text-sm text-[var(--text-3)]">{activeAlerts.length} activas</span>
            </div>

            <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <svg viewBox="0 0 100 100" className="w-full" style={{ height: 300 }}>
                    {[20, 40, 60, 80].map((v) => (
                        <g key={v}>
                            <line x1={v} y1={0} x2={v} y2={100} stroke="var(--border)" strokeWidth="0.15" />
                            <line x1={0} y1={v} x2={100} y2={v} stroke="var(--border)" strokeWidth="0.15" />
                        </g>
                    ))}

                    {zones.map((z) => {
                        const color = getZoneSeverity(z.id);
                        const count = getZoneAlertCount(z.id);
                        return (
                            <g key={z.id}>
                                <path
                                    d={z.path}
                                    fill={color ? color + '15' : 'rgba(255,255,255,0.02)'}
                                    stroke={color || 'var(--border)'}
                                    strokeWidth={color ? 0.6 : 0.3}
                                    rx="2"
                                />
                                <text x={z.cx} y={z.cy - 2} textAnchor="middle" fill="var(--text-3)" fontSize="3.5" fontFamily="Inter" fontWeight="500">
                                    {z.id}
                                </text>
                                {count > 0 && (
                                    <>
                                        <circle cx={z.cx} cy={z.cy + 4} r="3.5" fill={color || 'var(--text-3)'} opacity="0.9" />
                                        <text x={z.cx} y={z.cy + 5.5} textAnchor="middle" fill="white" fontSize="3.2" fontWeight="700">
                                            {count}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    })}

                    <line x1={50} y1={5} x2={50} y2={95} stroke="var(--text-3)" strokeWidth="0.2" strokeDasharray="1 1" />
                    <line x1={5} y1={50} x2={95} y2={50} stroke="var(--text-3)" strokeWidth="0.2" strokeDasharray="1 1" />
                </svg>
            </div>

            <div className="flex items-center gap-6 justify-center">
                {[
                    { label: 'Crítico', color: 'var(--red)' },
                    { label: 'Advertencia', color: 'var(--orange)' },
                    { label: 'Info', color: 'var(--blue)' },
                    { label: 'Libre', color: 'var(--text-3)' },
                ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded" style={{ background: color }} />
                        <span className="text-xs text-[var(--text-3)]">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

function getZoneColor(severity: string | null): string {
    if (severity === 'critical') return '#ff4d6a';
    if (severity === 'warning') return '#ff9f43';
    if (severity === 'info') return '#54a0ff';
    return '';
}

export default function NeighborhoodMap({ alerts }: NeighborhoodMapProps) {
    const activeAlerts = alerts.filter((a) => a.severity !== 'resolved');

    function getZoneSeverity(zoneId: string): string | null {
        const zoneAlerts = activeAlerts.filter(
            (a) => a.zone === zoneId || a.zone === 'Todas las Zonas' || a.zone === 'Sensor Network' || a.zone === 'Mi Zona'
        );
        if (zoneAlerts.some((a) => a.severity === 'critical')) return 'critical';
        if (zoneAlerts.some((a) => a.severity === 'warning')) return 'warning';
        if (zoneAlerts.length > 0) return 'info';
        return null;
    }

    function getZoneAlertCount(zoneId: string): number {
        return activeAlerts.filter(
            (a) => a.zone === zoneId || a.zone === 'Todas las Zonas' || a.zone === 'Sensor Network' || a.zone === 'Mi Zona'
        ).length;
    }

    return (
        <div className="card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                    Mapa de Zonas
                </h3>
                <span className="text-xs mono" style={{ color: 'var(--text-3)' }}>
                    {activeAlerts.length} alerta{activeAlerts.length !== 1 ? 's' : ''} activa{activeAlerts.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div
                className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
            >
                <svg viewBox="0 0 100 100" className="w-full" style={{ height: 260 }}>
                    {/* Grid */}
                    {[20, 40, 60, 80].map((v) => (
                        <g key={v}>
                            <line x1={v} y1={0} x2={v} y2={100} stroke="rgba(255,255,255,0.03)" strokeWidth="0.15" />
                            <line x1={0} y1={v} x2={100} y2={v} stroke="rgba(255,255,255,0.03)" strokeWidth="0.15" />
                        </g>
                    ))}

                    {/* Zones */}
                    {zones.map((z) => {
                        const severity = getZoneSeverity(z.id);
                        const color = getZoneColor(severity);
                        const count = getZoneAlertCount(z.id);
                        const hasAlert = count > 0;

                        return (
                            <g key={z.id}>
                                <path
                                    d={z.path}
                                    fill={hasAlert ? color + '12' : 'rgba(255,255,255,0.015)'}
                                    stroke={hasAlert ? color + '60' : 'rgba(255,255,255,0.06)'}
                                    strokeWidth={hasAlert ? 0.5 : 0.25}
                                    style={{
                                        transition: 'fill 0.5s ease, stroke 0.5s ease',
                                    }}
                                />
                                <text
                                    x={z.cx}
                                    y={z.cy - 2}
                                    textAnchor="middle"
                                    fill={hasAlert ? color : '#4a4e5c'}
                                    fontSize="3.2"
                                    fontFamily="Outfit"
                                    fontWeight="500"
                                >
                                    {z.id}
                                </text>
                                {count > 0 && (
                                    <>
                                        <circle
                                            cx={z.cx}
                                            cy={z.cy + 5}
                                            r="3"
                                            fill={color}
                                            opacity="0.85"
                                            style={{
                                                filter: severity === 'critical' ? `drop-shadow(0 0 3px ${color}80)` : 'none',
                                            }}
                                        >
                                            {severity === 'critical' && (
                                                <animate
                                                    attributeName="opacity"
                                                    values="0.85;0.4;0.85"
                                                    dur="1.5s"
                                                    repeatCount="indefinite"
                                                />
                                            )}
                                        </circle>
                                        <text
                                            x={z.cx}
                                            y={z.cy + 6.2}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="2.8"
                                            fontWeight="700"
                                            fontFamily="JetBrains Mono"
                                        >
                                            {count}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    })}

                    {/* Crosshairs */}
                    <line x1={50} y1={5} x2={50} y2={95} stroke="rgba(255,255,255,0.04)" strokeWidth="0.15" strokeDasharray="1 1.5" />
                    <line x1={5} y1={50} x2={95} y2={50} stroke="rgba(255,255,255,0.04)" strokeWidth="0.15" strokeDasharray="1 1.5" />
                </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 justify-center">
                {[
                    { label: 'Crítico', color: '#ff4d6a' },
                    { label: 'Advertencia', color: '#ff9f43' },
                    { label: 'Info', color: '#54a0ff' },
                    { label: 'Libre', color: '#4a4e5c' },
                ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded" style={{ background: color }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

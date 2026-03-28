'use client';

import { SensorData, Thresholds } from '@/hooks/useAlerts';

interface RiskGaugeProps {
    sensors: SensorData;
    thresholds: Thresholds;
}

function computeRiskIndex(sensors: SensorData, thresholds: Thresholds): number {
    let index = 0;

    // CO contribution (40% weight)
    const co = sensors['Monoxido']?.value;
    const coMax = thresholds['Monoxido']?.critical?.[1];
    if (co !== undefined && coMax) {
        index += Math.min(1, co / coMax) * 40;
    }

    // Metano contribution (40% weight)
    const metano = sensors['metano']?.value;
    const metanoMax = thresholds['metano']?.critical?.[1];
    if (metano !== undefined && metanoMax) {
        index += Math.min(1, metano / metanoMax) * 40;
    }

    // Temperature deviation (20% weight)
    const temp = sensors['Temperatura']?.value;
    const tempThreshold = thresholds['Temperatura'];
    if (temp !== undefined && tempThreshold) {
        const mid = (tempThreshold.warning[0] + tempThreshold.warning[1]) / 2;
        const range = (tempThreshold.critical[1] - tempThreshold.critical[0]) / 2;
        const deviation = Math.abs(temp - mid);
        index += Math.min(1, deviation / range) * 20;
    }

    return Math.round(Math.min(100, Math.max(0, index)));
}

function getRiskLabel(index: number): { label: string; color: string } {
    if (index <= 25) return { label: 'Bajo', color: 'var(--green)' };
    if (index <= 50) return { label: 'Moderado', color: 'var(--yellow)' };
    if (index <= 75) return { label: 'Alto', color: 'var(--orange)' };
    return { label: 'Crítico', color: 'var(--red)' };
}

export default function RiskGauge({ sensors, thresholds }: RiskGaugeProps) {
    const hasData = Object.keys(sensors).length > 0 && Object.keys(thresholds).length > 0;
    const index = hasData ? computeRiskIndex(sensors, thresholds) : 0;
    const { label, color } = getRiskLabel(index);

    // SVG arc math — semicircle gauge
    const radius = 80;
    const circumference = Math.PI * radius; // semicircle
    const offset = circumference - (index / 100) * circumference;

    // Gradient stops for the arc
    const gradientId = 'riskGradient';

    return (
        <div className="card p-6 flex flex-col items-center">
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4 self-start" style={{ color: 'var(--text-3)' }}>
                Índice de Riesgo Ambiental
            </h3>

            <div style={{ position: 'relative', width: '200px', height: '120px' }}>
                <svg viewBox="0 0 200 120" width="200" height="120">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00d68f" />
                            <stop offset="33%" stopColor="#feca57" />
                            <stop offset="66%" stopColor="#ff9f43" />
                            <stop offset="100%" stopColor="#ff4d6a" />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Value arc */}
                    {hasData && (
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke={`url(#${gradientId})`}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={offset}
                            style={{
                                transition: 'stroke-dashoffset 1s ease-out',
                                filter: `drop-shadow(0 0 6px ${color}40)`,
                            }}
                        />
                    )}

                    {/* Tick marks */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const angle = Math.PI - (tick / 100) * Math.PI;
                        const x1 = 100 + 90 * Math.cos(angle);
                        const y1 = 100 - 90 * Math.sin(angle);
                        const x2 = 100 + 95 * Math.cos(angle);
                        const y2 = 100 - 95 * Math.sin(angle);
                        return (
                            <line
                                key={tick}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="1.5"
                            />
                        );
                    })}
                </svg>

                {/* Center text */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                    }}
                >
                    <span
                        className="mono"
                        style={{
                            fontSize: '32px',
                            fontWeight: 700,
                            color: hasData ? color : 'var(--text-3)',
                            lineHeight: 1,
                        }}
                    >
                        {hasData ? index : '—'}
                    </span>
                    <p
                        className="text-xs font-semibold uppercase tracking-wider mt-1"
                        style={{ color: hasData ? color : 'var(--text-3)' }}
                    >
                        {hasData ? label : 'Sin datos'}
                    </p>
                </div>
            </div>

            {/* Scale labels */}
            <div className="flex items-center justify-between w-full mt-3 px-2">
                {[
                    { label: 'Bajo', color: 'var(--green)' },
                    { label: 'Moderado', color: 'var(--yellow)' },
                    { label: 'Alto', color: 'var(--orange)' },
                    { label: 'Crítico', color: 'var(--red)' },
                ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

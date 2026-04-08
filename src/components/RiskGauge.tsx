'use client';

import { SensorData, Thresholds } from '@/hooks/useAlerts';

interface RiskGaugeProps {
    sensors: SensorData;
    thresholds: Thresholds;
}

function computeRiskIndex(sensors: SensorData, thresholds: Thresholds): number {
    let index = 0;

    // CO contribution (40% weight) - CORREGIDO CON Number()
    const co = sensors['Monoxido']?.value;
    const coMax = thresholds['Monoxido']?.critical?.[1];
    if (co !== undefined && coMax) {
        index += Math.min(1, Number(co) / coMax) * 40;
    }

    // Metano contribution (40% weight) - CORREGIDO CON Number()
    const metano = sensors['metano']?.value;
    const metanoMax = thresholds['metano']?.critical?.[1];
    if (metano !== undefined && metanoMax) {
        index += Math.min(1, Number(metano) / metanoMax) * 40;
    }

    // Temperature deviation (20% weight) - CORREGIDO CON Number()
    const temp = sensors['Temperatura']?.value;
    const tempThreshold = thresholds['Temperatura'];
    if (temp !== undefined && tempThreshold) {
        const mid = (tempThreshold.warning[0] + tempThreshold.warning[1]) / 2;
        const range = (tempThreshold.critical[1] - tempThreshold.critical[0]) / 2;
        const deviation = Math.abs(Number(temp) - mid);
        index += Math.min(1, deviation / range) * 20;
    }

    return Math.round(Math.min(100, Math.max(0, index)));
}

function getRiskLabel(index: number): { label: string; color: string } {
    if (index <= 25) return { label: 'Bajo', color: '#10B981' };     // Emerald-500
    if (index <= 50) return { label: 'Moderado', color: '#FBBF24' }; // Amber-400
    if (index <= 75) return { label: 'Alto', color: '#F97316' };     // Orange-500
    return { label: 'Crítico', color: '#EF4444' };                   // Red-500
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            <h3 className="text-sm font-bold tracking-widest uppercase mb-4 self-start text-slate-500">
                Índice de Riesgo Ambiental
            </h3>

            <div style={{ position: 'relative', width: '200px', height: '120px' }}>
                <svg viewBox="0 0 200 120" width="200" height="120">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="33%" stopColor="#FBBF24" />
                            <stop offset="66%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />

                    {/* Value arc */}
                    {hasData && (
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke={`url(#${gradientId})`}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={offset}
                            style={{
                                transition: 'stroke-dashoffset 1s ease-out',
                                filter: `drop-shadow(0 2px 4px ${color}40)`,
                            }}
                        />
                    )}

                    {/* Tick marks */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const angle = Math.PI - (tick / 100) * Math.PI;
                        const x1 = 100 + 90 * Math.cos(angle);
                        const y1 = 100 - 90 * Math.sin(angle);
                        const x2 = 100 + 96 * Math.cos(angle);
                        const y2 = 100 - 96 * Math.sin(angle);
                        return (
                            <line
                                key={tick}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="#CBD5E1"
                                strokeWidth="2"
                                strokeLinecap="round"
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
                        className="font-mono"
                        style={{
                            fontSize: '40px',
                            fontWeight: 800,
                            color: hasData ? color : '#94A3B8',
                            lineHeight: 1,
                        }}
                    >
                        {hasData ? index : '—'}
                    </span>
                    <p
                        className="text-xs font-bold uppercase tracking-wider mt-1"
                        style={{ color: hasData ? color : '#94A3B8' }}
                    >
                        {hasData ? label : 'Sin datos'}
                    </p>
                </div>
            </div>

            {/* Scale labels */}
            <div className="flex items-center justify-between w-full mt-6 px-2">
                {[
                    { label: 'Bajo', color: '#10B981' },
                    { label: 'Moderado', color: '#FBBF24' },
                    { label: 'Alto', color: '#F97316' },
                    { label: 'Crítico', color: '#EF4444' },
                ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: s.color }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
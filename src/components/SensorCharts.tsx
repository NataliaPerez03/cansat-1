'use client';

import { SensorHistoryEntry } from '@/hooks/useAlerts';
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface SensorChartsProps {
    history: SensorHistoryEntry[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null;
    return (
        <div
            style={{
                background: 'rgba(14, 17, 25, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
        >
            <p style={{ color: '#8b8fa3', fontSize: '11px', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                {label}
            </p>
            {payload.map((entry: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
                    <span style={{ color: '#f0f2f5', fontSize: '13px', fontWeight: 600 }}>
                        {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                    </span>
                    <span style={{ color: '#4a4e5c', fontSize: '11px' }}>{entry.name}</span>
                </div>
            ))}
        </div>
    );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function SensorCharts({ history }: SensorChartsProps) {
    if (history.length < 2) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {['Niveles de Gases', 'Presión y Altitud'].map((title) => (
                    <div key={title} className="card p-6">
                        <h3 className="text-sm font-semibold tracking-wide uppercase mb-4" style={{ color: 'var(--text-3)' }}>
                            {title}
                        </h3>
                        <div className="flex items-center justify-center" style={{ height: '220px', color: 'var(--text-3)' }}>
                            <p className="text-sm">Acumulando datos...</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gas Levels Chart */}
            <div className="card p-6">
                <h3 className="text-sm font-semibold tracking-wide uppercase mb-4" style={{ color: 'var(--text-3)' }}>
                    Niveles de Gases
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradCO" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff9f43" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#ff9f43" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradMetano" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a55eea" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#a55eea" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#4a4e5c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#4a4e5c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ fontSize: '11px', color: '#8b8fa3' }}
                            iconType="circle"
                            iconSize={8}
                        />
                        <Area
                            type="monotone"
                            dataKey="Monoxido"
                            name="CO (ppm)"
                            stroke="#ff9f43"
                            fill="url(#gradCO)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#ff9f43', stroke: '#06080d', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="metano"
                            name="Metano (ppm)"
                            stroke="#a55eea"
                            fill="url(#gradMetano)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#a55eea', stroke: '#06080d', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Pressure & Altitude Chart */}
            <div className="card p-6">
                <h3 className="text-sm font-semibold tracking-wide uppercase mb-4" style={{ color: 'var(--text-3)' }}>
                    Presión y Altitud
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#4a4e5c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fill: '#4a4e5c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: '#4a4e5c', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ fontSize: '11px', color: '#8b8fa3' }}
                            iconType="circle"
                            iconSize={8}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="presion_atmosferica"
                            name="Presión (hPa)"
                            stroke="#54a0ff"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#54a0ff', stroke: '#06080d', strokeWidth: 2 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="altitud"
                            name="Altitud (m)"
                            stroke="#0abde3"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#0abde3', stroke: '#06080d', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

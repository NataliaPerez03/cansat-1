'use client';

import { SensorData, Thresholds } from '@/hooks/useAlerts';
import {
    Thermometer,
    Droplets,
    Wind,
    FlaskConical,
    Gauge,
    Mountain,
    MoveHorizontal,
    MoveVertical,
    Move3d,
} from 'lucide-react';
import { ComponentType } from 'react';

interface SensorConfig {
    field: string;
    label: string;
    unit: string;
    Icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
    thresholdKey?: string;
}

const SENSOR_CONFIG: SensorConfig[] = [
    { field: 'Temperatura', label: 'Temperatura', unit: '°C', Icon: Thermometer, thresholdKey: 'Temperatura' },
    { field: 'Humedad_aire', label: 'Humedad', unit: '%', Icon: Droplets, thresholdKey: 'Humedad_aire' },
    { field: 'Monoxido', label: 'CO', unit: 'ppm', Icon: Wind, thresholdKey: 'Monoxido' },
    { field: 'metano', label: 'Metano', unit: 'ppm', Icon: FlaskConical, thresholdKey: 'metano' },
    { field: 'presion_atmosferica', label: 'Presión', unit: 'hPa', Icon: Gauge, thresholdKey: 'presion_atmosferica' },
    { field: 'altitud', label: 'Altitud', unit: 'm', Icon: Mountain, thresholdKey: 'altitud' },
    { field: 'x', label: 'Accel X', unit: 'm/s²', Icon: MoveHorizontal },
    { field: 'y', label: 'Accel Y', unit: 'm/s²', Icon: MoveVertical },
    { field: 'z', label: 'Accel Z', unit: 'm/s²', Icon: Move3d },
];

function getSensorState(
    value: number | undefined,
    thresholdKey: string | undefined,
    thresholds: Thresholds
): 'normal' | 'warning' | 'critical' | 'unknown' {
    if (value === undefined || !thresholdKey || !thresholds[thresholdKey]) return 'unknown';
    const t = thresholds[thresholdKey];
    if (value < t.critical[0] || value > t.critical[1]) return 'critical';
    if (value < t.warning[0] || value > t.warning[1]) return 'warning';
    return 'normal';
}

const stateColors = {
    normal: { color: 'var(--green)', dim: 'var(--green-dim)', label: 'Normal' },
    warning: { color: 'var(--yellow)', dim: 'var(--yellow-dim)', label: 'Advertencia' },
    critical: { color: 'var(--red)', dim: 'var(--red-dim)', label: 'Crítico' },
    unknown: { color: 'var(--text-3)', dim: 'rgba(255,255,255,0.03)', label: 'Sin dato' },
};

interface SensorPanelProps {
    sensors: SensorData;
    connected: boolean | null;
    thresholds: Thresholds;
}

export default function SensorPanel({ sensors, connected, thresholds }: SensorPanelProps) {
    const hasData = Object.keys(sensors).length > 0;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                    Sensores en Vivo
                </h2>
                <div className="flex items-center gap-4">
                    {['normal', 'warning', 'critical'].map((s) => {
                        const sc = stateColors[s as keyof typeof stateColors];
                        return (
                            <div key={s} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ background: sc.color }} />
                                <span className="text-xs" style={{ color: 'var(--text-3)' }}>{sc.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {!hasData ? (
                <div className="card p-10 text-center">
                    <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                        {connected === false ? 'No se puede conectar a InfluxDB' : 'Esperando datos de sensores...'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 stagger">
                    {SENSOR_CONFIG.map(({ field, label, unit, Icon, thresholdKey }) => {
                        const reading = sensors[field];
                        const value = reading?.value;
                        const state = getSensorState(value, thresholdKey, thresholds);
                        const sc = stateColors[state];

                        return (
                            <div
                                key={field}
                                className={`card animate-fade-in-up tooltip-trigger ${state === 'critical' ? 'state-critical' : state === 'warning' ? 'state-warning' : state === 'normal' ? 'state-normal' : ''
                                    }`}
                                style={{
                                    padding: '16px 18px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Background glow for critical */}
                                {state === 'critical' && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'radial-gradient(ellipse at top left, rgba(255,77,106,0.06) 0%, transparent 70%)',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                )}

                                {/* Header */}
                                <div className="flex items-center justify-between mb-3" style={{ position: 'relative' }}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: sc.dim }}
                                        >
                                            <Icon size={15} style={{ color: sc.color }} />
                                        </div>
                                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                                            {label}
                                        </span>
                                    </div>
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            background: sc.color,
                                            animation: state === 'critical' ? 'pulse-dot 1s ease-in-out infinite' : 'none',
                                        }}
                                    />
                                </div>

                                {/* Value */}
                                <div className="flex items-baseline gap-1.5" style={{ position: 'relative' }}>
                                    <span className="mono text-2xl font-bold" style={{ color: 'var(--text)' }}>
                                        {value !== undefined ? value.toFixed(1) : '—'}
                                    </span>
                                    <span className="text-xs" style={{ color: 'var(--text-3)' }}>{unit}</span>
                                </div>

                                {/* Mini range bar */}
                                {thresholdKey && thresholds[thresholdKey] && value !== undefined && (
                                    <div className="mt-3" style={{ position: 'relative' }}>
                                        <div
                                            className="w-full rounded-full"
                                            style={{ height: '3px', background: 'rgba(255,255,255,0.05)' }}
                                        >
                                            <div
                                                className="rounded-full"
                                                style={{
                                                    height: '3px',
                                                    width: `${Math.min(100, Math.max(2, ((value - thresholds[thresholdKey].critical[0]) / (thresholds[thresholdKey].critical[1] - thresholds[thresholdKey].critical[0])) * 100))}%`,
                                                    background: sc.color,
                                                    transition: 'width 0.6s ease, background 0.3s ease',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Tooltip */}
                                {thresholdKey && thresholds[thresholdKey] && (
                                    <div className="tooltip">
                                        Normal: {thresholds[thresholdKey].warning[0]}–{thresholds[thresholdKey].warning[1]} {unit}
                                        <br />
                                        Crítico: &lt;{thresholds[thresholdKey].critical[0]} o &gt;{thresholds[thresholdKey].critical[1]} {unit}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

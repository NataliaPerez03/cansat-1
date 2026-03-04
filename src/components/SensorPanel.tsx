'use client';

import { SensorData } from '@/hooks/useAlerts';

const SENSOR_CONFIG: { field: string; label: string; unit: string; icon: string }[] = [
    { field: 'Temperatura', label: 'Temperatura', unit: '°C', icon: '🌡' },
    { field: 'Humedad_aire', label: 'Humedad', unit: '%', icon: '💧' },
    { field: 'Monoxido', label: 'CO', unit: 'ppm', icon: '⚗' },
    { field: 'metano', label: 'Metano', unit: 'ppm', icon: '🔬' },
    { field: 'presion_atmosferica', label: 'Presión', unit: 'hPa', icon: '🌀' },
    { field: 'altitud', label: 'Altitud', unit: 'm', icon: '📍' },
    { field: 'x', label: 'Accel X', unit: 'm/s²', icon: '↔' },
    { field: 'y', label: 'Accel Y', unit: 'm/s²', icon: '↕' },
    { field: 'z', label: 'Accel Z', unit: 'm/s²', icon: '⊙' },
];

interface SensorPanelProps {
    sensors: SensorData;
    connected: boolean | null;
    lastQueried: string | null;
}

export default function SensorPanel({ sensors, connected, lastQueried }: SensorPanelProps) {
    const hasData = Object.keys(sensors).length > 0;

    return (
        <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-sm text-[var(--text-3)] tracking-wide uppercase font-semibold">Sensores en Vivo</h2>
                <div className="flex items-center gap-2">
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                            background: connected === true ? 'var(--green)' : connected === false ? 'var(--red)' : 'var(--text-3)',
                            animation: connected === true ? 'pulse-dot 2s ease-in-out infinite' : 'none',
                        }}
                    />
                    <span className="text-sm text-[var(--text-3)]">
                        {connected === true ? 'Conectado' : connected === false ? 'Desconectado' : 'Consultando...'}
                    </span>
                </div>
            </div>

            {!hasData ? (
                <div className="py-10 text-center">
                    <p className="text-base text-[var(--text-3)]">
                        {connected === false ? 'No se puede conectar a InfluxDB' : 'Esperando datos de sensores...'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {SENSOR_CONFIG.map(({ field, label, unit, icon }) => {
                        const reading = sensors[field];
                        return (
                            <div
                                key={field}
                                className="rounded-xl px-3.5 py-3 flex flex-col gap-1.5"
                                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{icon}</span>
                                    <span className="text-xs text-[var(--text-3)] uppercase tracking-wider font-medium">{label}</span>
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="mono text-xl font-bold text-[var(--text)]">
                                        {reading ? reading.value.toFixed(1) : '—'}
                                    </span>
                                    <span className="text-xs text-[var(--text-3)]">{unit}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {lastQueried && (
                <p className="text-xs text-[var(--text-3)] text-right">
                    Última consulta: {new Date(lastQueried).toLocaleTimeString()}
                </p>
            )}
        </div>
    );
}

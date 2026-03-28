import { NextResponse } from 'next/server';
import { queryApi, BUCKET } from '@/lib/influx';

// ── Thresholds for alert generation ──
const THRESHOLDS: Record<string, { warning: [number, number]; critical: [number, number]; unit: string; label: string }> = {
    Temperatura: {
        warning: [0, 40],      // outside this range → warning
        critical: [-10, 50],   // outside this range → critical
        unit: '°C',
        label: 'Temperatura',
    },
    Humedad_aire: {
        warning: [20, 80],
        critical: [10, 95],
        unit: '%',
        label: 'Humedad del Aire',
    },
    Monoxido: {
        warning: [0, 35],      // CO ppm — above 35 is warning
        critical: [0, 100],    // above 100 is critical
        unit: 'ppm',
        label: 'Monóxido de Carbono',
    },
    metano: {
        warning: [0, 1000],    // methane ppm
        critical: [0, 5000],
        unit: 'ppm',
        label: 'Metano',
    },
    presion_atmosferica: {
        warning: [0, 720],
        critical: [0, 730],
        unit: 'hPa',
        label: 'Presión Atmosférica',
    },
    altitud: {
        warning: [-50, 2000],
        critical: [-100, 5000],
        unit: 'm',
        label: 'Altitud',
    },
};

// Check if a value is outside a [min, max] range
function outsideRange(value: number, range: [number, number]): boolean {
    return value < range[0] || value > range[1];
}

interface SensorReading {
    field: string;
    value: number;
    time: string;
}

export async function GET() {
    try {
        // Query last 30 seconds of data
        const fluxQuery = `
      from(bucket: "${BUCKET}")
        |> range(start: -30s)
        |> filter(fn: (r) => r["_measurement"] == "Sensores")
        |> filter(fn: (r) =>
            r["_field"] == "Humedad_aire" or
            r["_field"] == "Temperatura" or
            r["_field"] == "Monoxido" or
            r["_field"] == "metano" or
            r["_field"] == "x" or
            r["_field"] == "y" or
            r["_field"] == "z" or
            r["_field"] == "presion_atmosferica" or
            r["_field"] == "altitud"
        )
        |> last()
    `;

        const readings: SensorReading[] = [];

        await new Promise<void>((resolve, reject) => {
            queryApi.queryRows(fluxQuery, {
                next(row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    readings.push({
                        field: o._field as string,
                        value: Number(o._value),
                        time: o._time as string,
                    });
                },
                error(err) {
                    reject(err);
                },
                complete() {
                    resolve();
                },
            });
        });

        // Build current sensor values map
        const sensors: Record<string, { value: number; time: string }> = {};
        for (const r of readings) {
            sensors[r.field] = { value: r.value, time: r.time };
        }

        // Generate alerts from thresholds
        interface GeneratedAlert {
            id: string;
            title: string;
            description: string;
            severity: 'critical' | 'warning' | 'info';
            zone: string;
            source: string;
            field: string;
            value: number;
            timestamp: string;
        }

        const alerts: GeneratedAlert[] = [];

        for (const [field, config] of Object.entries(THRESHOLDS)) {
            const reading = sensors[field];
            if (!reading) continue;

            const { value } = reading;

            if (outsideRange(value, config.critical)) {
                alerts.push({
                    id: `influx-${field}-critical`,
                    title: `${config.label} — ¡Nivel Crítico!`,
                    description: `${config.label} registra ${value.toFixed(1)} ${config.unit}. Rango seguro: ${config.critical[0]}–${config.critical[1]} ${config.unit}.`,
                    severity: 'critical',
                    zone: 'Sensor Network',
                    source: 'InfluxDB — Sensores',
                    field,
                    value,
                    timestamp: reading.time,
                });
            } else if (outsideRange(value, config.warning)) {
                alerts.push({
                    id: `influx-${field}-warning`,
                    title: `${config.label} — Nivel de Advertencia`,
                    description: `${config.label} registra ${value.toFixed(1)} ${config.unit}. Rango normal: ${config.warning[0]}–${config.warning[1]} ${config.unit}.`,
                    severity: 'warning',
                    zone: 'Sensor Network',
                    source: 'InfluxDB — Sensores',
                    field,
                    value,
                    timestamp: reading.time,
                });
            }
        }

        // Accelerometer: check for impact / free-fall
        const ax = sensors['x']?.value;
        const ay = sensors['y']?.value;
        const az = sensors['z']?.value;

        if (ax !== undefined && ay !== undefined && az !== undefined) {
            const totalG = Math.sqrt(ax * ax + ay * ay + az * az);

            if (totalG > 30) {
                alerts.push({
                    id: 'influx-accel-impact',
                    title: 'Impacto Detectado',
                    description: `Aceleración total: ${totalG.toFixed(1)} m/s². Posible impacto o caída.`,
                    severity: 'critical',
                    zone: 'Sensor Network',
                    source: 'InfluxDB — Acelerómetro',
                    field: 'accelerometer',
                    value: totalG,
                    timestamp: sensors['x'].time,
                });
            } else if (totalG < 2) {
                alerts.push({
                    id: 'influx-accel-freefall',
                    title: 'Caída Libre Detectada',
                    description: `Aceleración total: ${totalG.toFixed(1)} m/s². Posible caída libre.`,
                    severity: 'critical',
                    zone: 'Sensor Network',
                    source: 'InfluxDB — Acelerómetro',
                    field: 'accelerometer',
                    value: totalG,
                    timestamp: sensors['x'].time,
                });
            }
        }

        return NextResponse.json({
            sensors,
            alerts,
            thresholds: THRESHOLDS,
            queriedAt: new Date().toISOString(),
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('InfluxDB query error:', message);
        return NextResponse.json(
            { error: 'Failed to query InfluxDB', detail: message, sensors: {}, alerts: [] },
            { status: 500 }
        );
    }
}

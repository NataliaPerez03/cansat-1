'use client';

import { motion } from 'framer-motion';
import {
  Droplets,
  FlaskConical,
  Gauge,
  Mountain,
  Move3d,
  MoveHorizontal,
  MoveVertical,
  Thermometer,
  Wind,
} from 'lucide-react';
import { type ComponentType } from 'react';
import { type SensorData, type Thresholds } from '@/hooks/useAlerts';

interface SensorConfig {
  field: string;
  label: string;
  unit: string;
  Icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
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
  rawValue: string | number | undefined,
  thresholdKey: string | undefined,
  thresholds: Thresholds,
): 'normal' | 'warning' | 'critical' | 'unknown' {
  if (rawValue === undefined || !thresholdKey || !thresholds[thresholdKey]) return 'unknown';

  const value = Number(rawValue);
  if (Number.isNaN(value)) return 'unknown';

  const range = thresholds[thresholdKey];
  if (value < range.critical[0] || value > range.critical[1]) return 'critical';
  if (value < range.warning[0] || value > range.warning[1]) return 'warning';

  return 'normal';
}

const stateStyles = {
  normal: { color: 'var(--success)', label: 'Óptimo' },
  warning: { color: 'var(--warning)', label: 'Advertencia' },
  critical: { color: 'var(--critical)', label: 'Crítico' },
  unknown: { color: 'var(--muted-foreground)', label: 'Sin datos' },
};

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

interface SensorPanelProps {
  sensors: SensorData;
  connected: boolean | null;
  thresholds: Thresholds;
}

export default function SensorPanel({ sensors, connected, thresholds }: SensorPanelProps) {
  const hasData = Object.keys(sensors).length > 0;

  if (!hasData) {
    return (
      <div className="surface px-8 py-16">
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          {connected === false
            ? 'No fue posible establecer conexión con el nodo local. La telemetría volverá a aparecer cuando se recupere el enlace.'
            : 'Esperando la primera lectura del flujo de sensores.'}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
      className="grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3"
    >
      {SENSOR_CONFIG.map(({ field, label, unit, Icon, thresholdKey }) => {
        const reading = sensors[field];
        const rawValue = reading?.value;
        const numericValue = rawValue !== undefined && !Number.isNaN(Number(rawValue)) ? Number(rawValue) : null;
        const state = getSensorState(rawValue, thresholdKey, thresholds);
        const style = stateStyles[state];
        const threshold = thresholdKey ? thresholds[thresholdKey] : undefined;

        const progress = threshold && numericValue !== null
          ? Math.min(
              100,
              Math.max(
                4,
                ((numericValue - threshold.critical[0]) / (threshold.critical[1] - threshold.critical[0])) * 100,
              ),
            )
          : null;

        return (
          <motion.article key={field} variants={itemVariants} className="border-t border-border/80 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-kicker">{label}</p>
                <div className="mt-4 flex items-end gap-2">
                  <span
                    className="text-[2.35rem] font-semibold tracking-[-0.07em] text-foreground md:text-[3rem]"
                    style={state === 'critical' ? { color: style.color } : undefined}
                  >
                    {numericValue !== null ? numericValue.toFixed(1) : rawValue ?? '—'}
                  </span>
                  <span className="pb-2 font-mono text-xs uppercase tracking-[0.26em] text-muted-foreground">
                    {unit}
                  </span>
                </div>
              </div>

              <Icon size={18} strokeWidth={2.2} className="mt-1 text-muted-foreground" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: style.color }} />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em]" style={{ color: style.color }}>
                  {style.label}
                </span>
              </div>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                {reading?.time ?? 'Sin marca'}
              </span>
            </div>

            {progress !== null ? (
              <div className="mt-5 h-[2px] overflow-hidden rounded-full bg-border/80">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: style.color }}
                />
              </div>
            ) : null}
          </motion.article>
        );
      })}
    </motion.div>
  );
}

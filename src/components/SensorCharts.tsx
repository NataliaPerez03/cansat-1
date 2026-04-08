'use client';

import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { type SensorHistoryEntry } from '@/hooks/useAlerts';

interface SensorChartsProps {
  history: SensorHistoryEntry[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-[1.4rem] border border-border/80 bg-panel-strong px-4 py-4 shadow-[0_18px_40px_rgba(23,30,45,0.08)]">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-primary">{label}</p>
      <div className="mt-3 space-y-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 text-sm text-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium">{typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function EmptyState() {
  return (
    <div className="surface flex min-h-[23rem] items-center px-8 py-12">
      <p className="max-w-sm text-base leading-7 text-muted-foreground">
        El histórico todavía no tiene suficientes muestras para dibujar la serie.
      </p>
    </div>
  );
}

export default function SensorCharts({ history }: SensorChartsProps) {
  if (history.length < 2) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <EmptyState />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="surface p-6 md:p-8"
      >
        <div className="mb-8 space-y-3">
          <p className="text-kicker">Gases</p>
          <h3 className="text-2xl tracking-[-0.05em]">Monóxido y metano</h3>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Evolución reciente de concentración para detectar incrementos sostenidos o picos súbitos.
          </p>
        </div>

        <div className="h-[20rem] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--warning)" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="var(--warning)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMetano" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 8" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1.2 }} />
              <Legend
                wrapperStyle={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', paddingTop: '20px' }}
                iconType="circle"
                iconSize={7}
              />
              <Area
                type="monotone"
                dataKey="Monoxido"
                name="CO"
                stroke="var(--warning)"
                fill="url(#gradCO)"
                strokeWidth={2.8}
                dot={false}
                activeDot={{ r: 5, fill: 'var(--warning)', stroke: 'var(--panel-strong)', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="metano"
                name="CH4"
                stroke="var(--primary)"
                fill="url(#gradMetano)"
                strokeWidth={2.8}
                dot={false}
                activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--panel-strong)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
        className="surface p-6 md:p-8"
      >
        <div className="mb-8 space-y-3">
          <p className="text-kicker">Presión y altitud</p>
          <h3 className="text-2xl tracking-[-0.05em]">Estabilidad barométrica</h3>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Cruce de presión atmosférica y altitud para revisar variaciones del entorno en la misma ventana temporal.
          </p>
        </div>

        <div className="h-[20rem] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 8" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1.2 }} />
              <Legend
                wrapperStyle={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', paddingTop: '20px' }}
                iconType="circle"
                iconSize={7}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="presion_atmosferica"
                name="Presión"
                stroke="var(--primary)"
                strokeWidth={2.8}
                dot={false}
                activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--panel-strong)', strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="altitud"
                name="Altitud"
                stroke="var(--success)"
                strokeWidth={2.8}
                dot={false}
                activeDot={{ r: 5, fill: 'var(--success)', stroke: 'var(--panel-strong)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>
    </div>
  );
}

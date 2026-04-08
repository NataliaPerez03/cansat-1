'use client';

import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { type ComponentType } from 'react';
import { type Alert, type Severity } from '@/hooks/useAlerts';

const severityConfig: Record<
  Severity,
  {
    color: string;
    label: string;
    Icon: ComponentType<{ size?: number; className?: string }>;
  }
> = {
  critical: { color: 'var(--critical)', label: 'Crítico', Icon: AlertTriangle },
  warning: { color: 'var(--warning)', label: 'Advertencia', Icon: AlertCircle },
  info: { color: 'var(--primary)', label: 'Informativo', Icon: Info },
  resolved: { color: 'var(--success)', label: 'Resuelto', Icon: CheckCircle },
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `hace ${seconds}s`;
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;

  return `hace ${Math.floor(seconds / 3600)}h`;
}

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const { Icon } = config;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="border-t border-border/80 py-8 first:pt-0"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2" style={{ color: config.color }}>
              <Icon size={15} />
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.3em]">{config.label}</span>
            </div>
            <span className="text-sm text-muted-foreground">{alert.zone}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{timeAgo(alert.timestamp)}</span>
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.24em]">{alert.source}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem] md:items-end">
          <div className="space-y-3">
            <h3 className="text-[clamp(1.5rem,2.8vw,2.35rem)] tracking-[-0.05em]">{alert.title}</h3>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{alert.description}</p>
          </div>

          <div className="md:text-right">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-muted-foreground">
              Registro operativo
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

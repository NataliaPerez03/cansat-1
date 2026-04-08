'use client';

import { motion } from 'framer-motion';
import { type Alert } from '@/hooks/useAlerts';

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

function getZoneColor(severity: string | null) {
  if (severity === 'critical') return 'var(--critical)';
  if (severity === 'warning') return 'var(--warning)';
  if (severity === 'info') return 'var(--primary)';

  return 'var(--border)';
}

export default function NeighborhoodMap({ alerts }: NeighborhoodMapProps) {
  const activeAlerts = alerts.filter((alert) => alert.severity !== 'resolved');

  function getZoneSeverity(zoneId: string) {
    const zoneAlerts = activeAlerts.filter(
      (alert) =>
        alert.zone === zoneId ||
        alert.zone === 'Todas las Zonas' ||
        alert.zone === 'Sensor Network' ||
        alert.zone === 'Mi Zona',
    );

    if (zoneAlerts.some((alert) => alert.severity === 'critical')) return 'critical';
    if (zoneAlerts.some((alert) => alert.severity === 'warning')) return 'warning';
    if (zoneAlerts.length > 0) return 'info';

    return null;
  }

  function getZoneAlertCount(zoneId: string) {
    return activeAlerts.filter(
      (alert) =>
        alert.zone === zoneId ||
        alert.zone === 'Todas las Zonas' ||
        alert.zone === 'Sensor Network' ||
        alert.zone === 'Mi Zona',
    ).length;
  }

  return (
    <div className="surface relative min-h-[28rem] overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-7 py-6">
        <div>
          <p className="text-kicker">Plano barrial</p>
          <h3 className="mt-3 text-2xl tracking-[-0.05em]">Distribución de incidentes</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-critical" />
          <span className="h-2 w-2 rounded-full bg-warning" />
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
      </div>

      <div className="absolute inset-0 top-20">
        <svg viewBox="0 0 100 100" className="h-full w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0.02))]">
          {[20, 40, 60, 80].map((value) => (
            <g key={value}>
              <line x1={value} y1={0} x2={value} y2={100} stroke="var(--border)" strokeWidth="0.18" strokeDasharray="2 3" />
              <line x1={0} y1={value} x2={100} y2={value} stroke="var(--border)" strokeWidth="0.18" strokeDasharray="2 3" />
            </g>
          ))}

          {zones.map((zone) => {
            const severity = getZoneSeverity(zone.id);
            const color = getZoneColor(severity);
            const count = getZoneAlertCount(zone.id);
            const hasAlert = count > 0;

            return (
              <motion.g key={zone.id} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }}>
                <path
                  d={zone.path}
                  fill={color}
                  fillOpacity={hasAlert ? 0.12 : 0}
                  stroke={color}
                  strokeWidth={hasAlert ? 0.85 : 0.35}
                  className="transition-all duration-500 ease-out"
                />
                <text
                  x={zone.cx}
                  y={zone.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={hasAlert ? color : 'var(--muted-foreground)'}
                  fontSize="3"
                  fontWeight="600"
                  letterSpacing="0.08em"
                >
                  {zone.id}
                </text>
                {count > 0 ? (
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    cx={zone.cx}
                    cy={zone.cy + 4.2}
                    r="2.35"
                    fill={color}
                  />
                ) : null}
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border/70 bg-panel px-7 py-5">
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div>
            <p className="text-kicker">Cobertura</p>
            <p className="mt-2 font-medium text-foreground">Sector Doña Juana</p>
          </div>
          <div>
            <p className="text-kicker">Alertas en mapa</p>
            <p className="mt-2 font-medium text-foreground">{activeAlerts.length}</p>
          </div>
          <div>
            <p className="text-kicker">Modelo</p>
            <p className="mt-2 font-medium text-foreground">Plano simplificado</p>
          </div>
        </div>
      </div>
    </div>
  );
}

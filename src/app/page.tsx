'use client';

import AlertCard from '@/components/AlertCard';
import EmergencyContacts from '@/components/EmergencyContacts';
import NeighborhoodMap from '@/components/NeighborhoodMap';
import SafetyTips from '@/components/SafetyTips';
import SensorCharts from '@/components/SensorCharts';
import SensorPanel from '@/components/SensorPanel';
import { useAlerts, type SensorData } from '@/hooks/useAlerts';
import { motion } from 'framer-motion';
import {
  Activity,
  MapPin,
  Radio,
  ShieldCheck,
  Thermometer,
  Waves,
  Wifi,
  WifiOff,
  Wind,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function parseWifiNetworks(wifiString: string | undefined) {
  if (!wifiString) return [];

  return wifiString
    .split('|')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getNumericSensorValue(sensors: SensorData, field: string) {
  const rawValue = sensors[field]?.value;
  const numericValue = Number(rawValue);

  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatMetric(value: number | null, digits = 1) {
  if (value === null) return '--';
  return value.toFixed(digits);
}

function formatLastSync(lastQueried: string | null) {
  if (!lastQueried) return 'Sin lectura';

  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(lastQueried));
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function PremiumDashboard() {
  const {
    alerts,
    sensors,
    sensorHistory,
    thresholds,
    connected,
    redesWifi,
    lastQueried,
    stats,
  } = useAlerts();

  const wifiNetworks = parseWifiNetworks(redesWifi);
  const activeAlerts = alerts.filter((alert) => alert.severity !== 'resolved');
  const isCritical = activeAlerts.some((alert) => alert.severity === 'critical');
  const isWarning = activeAlerts.some((alert) => alert.severity === 'warning');

  const statusTone = isCritical
    ? { label: 'Respuesta crítica', color: 'var(--critical)' }
    : isWarning
      ? { label: 'Observación activa', color: 'var(--warning)' }
      : { label: 'Condición estable', color: 'var(--success)' };

  const statusSubtitle = isCritical
    ? 'Se detectaron concentraciones fuera de rango. Mantén el protocolo de evacuación listo.'
    : isWarning
      ? 'El sistema detecta variaciones atípicas. Conviene seguir de cerca la siguiente lectura.'
      : 'Las lecturas se mantienen dentro de los rangos esperados para el sector Doña Juana.';

  const lastSyncLabel = formatLastSync(lastQueried);

  const temperature = getNumericSensorValue(sensors, 'Temperatura');
  const humidity = getNumericSensorValue(sensors, 'Humedad_aire');
  const monoxide = getNumericSensorValue(sensors, 'Monoxido');
  const methane = getNumericSensorValue(sensors, 'metano');

  const heroReadings = [
    { label: 'Temperatura', value: formatMetric(temperature), unit: '°C', Icon: Thermometer },
    { label: 'Humedad', value: formatMetric(humidity), unit: '%', Icon: Waves },
    { label: 'CO', value: formatMetric(monoxide), unit: 'ppm', Icon: Wind },
    { label: 'Metano', value: formatMetric(methane), unit: 'ppm', Icon: Activity },
  ];

  const operationalRows = [
    { label: 'Estado actual', value: statusTone.label, detail: statusSubtitle, tone: statusTone.color },
    { label: 'Alertas activas', value: activeAlerts.length.toString().padStart(2, '0'), detail: 'Incidentes sin resolver en la sesión.' },
    { label: 'Malla local', value: wifiNetworks.length.toString().padStart(2, '0'), detail: 'Nodos Wi-Fi visibles para continuidad operativa.' },
    { label: 'Última lectura', value: lastSyncLabel, detail: connected ? 'Flujo sincronizado con el nodo principal.' : 'Esperando enlace con la fuente de datos.' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground selection:bg-primary/10 selection:text-primary">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(76,102,168,0.14),transparent_58%)]" />
      <div className="pointer-events-none absolute right-0 top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,214,120,0.12),transparent_62%)] blur-3xl" />

      <header className="relative z-10 px-6 pb-8 pt-6 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-border/80 bg-panel-strong">
              <Wind size={22} className="text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-kicker">CanSat Doña Juana</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Centro de control atmosférico</span>
                <span className="hidden h-1 w-1 rounded-full bg-border md:block" />
                <span className="inline-flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  Ciudad Bolívar, Bogotá
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-panel px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {connected ? (
                <>
                  <Wifi size={14} className="text-success" />
                  Enlace activo
                </>
              ) : connected === false ? (
                <>
                  <WifiOff size={14} className="text-critical" />
                  Sin señal
                </>
              ) : (
                <>
                  <Radio size={14} className="text-primary" />
                  Sincronizando
                </>
              )}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-panel px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              <Activity size={14} className="text-primary" />
              Corte {lastSyncLabel}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-24 md:px-10 lg:px-14">
        <section className="mx-auto grid max-w-[1440px] gap-14 pb-14 pt-4 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:items-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="space-y-5">
              <p className="text-kicker">Lectura operativa</p>
              <div className="space-y-6">
                <h1 className="text-display text-balance">
                  Doña Juana
                  <br />
                  <span style={{ color: statusTone.color }}>{statusTone.label}</span>
                </h1>
                <p className="max-w-2xl text-lead">
                  Monitoreo ambiental en tiempo real para detectar gases, variaciones de presión y eventos de riesgo con una interfaz más clara, sobria y utilitaria.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {heroReadings.map(({ label, value, unit, Icon }) => (
                <div key={label} className="section-rule">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-kicker">{label}</span>
                    <Icon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-semibold tracking-[-0.06em] text-foreground md:text-5xl">
                      {value}
                    </span>
                    <span className="pb-2 font-mono text-xs uppercase tracking-[0.26em] text-muted-foreground">
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="surface premium-shadow h-full p-8"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-kicker">Resumen de turno</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Sala operativa</h2>
                </div>
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: statusTone.color }} />
              </div>

              <div className="mt-10 flex-1 divide-y divide-border/70">
                {operationalRows.map((row) => (
                  <div key={row.label} className="py-5 first:pt-0 last:pb-0">
                    <p className="text-kicker">{row.label}</p>
                    <p
                      className="mt-3 text-[1.6rem] font-semibold tracking-[-0.05em] text-foreground"
                      style={row.tone ? { color: row.tone } : undefined}
                    >
                      {row.value}
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{row.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </section>

        <section className="mx-auto max-w-[1440px] border-t border-border/70 py-12">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-kicker">Telemetría seleccionada</p>
              <h2 className="text-[clamp(2.2rem,4vw,3.75rem)] tracking-[-0.06em]">Lectura actual del sistema</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                Las métricas principales se presentan como un tablero lineal: menos ruido visual, más lectura inmediata.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="rounded-full border border-border/80 bg-panel px-4 py-3">
                <span className="text-kicker">Riesgo crítico</span>
                <p className="mt-2 font-medium text-foreground">{stats.critical} eventos</p>
              </div>
              <div className="rounded-full border border-border/80 bg-panel px-4 py-3">
                <span className="text-kicker">Cobertura local</span>
                <p className="mt-2 font-medium text-foreground">{wifiNetworks.length || 0} nodos detectados</p>
              </div>
            </div>
          </div>

          <SensorPanel sensors={sensors} connected={connected} thresholds={thresholds} />
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-16 border-t border-border/70 py-20 lg:grid-cols-[minmax(0,1.05fr)_25rem]">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-kicker">Territorio y alertas</p>
              <h2 className="text-[clamp(2.2rem,4vw,3.75rem)] tracking-[-0.06em]">Incidentes en seguimiento</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                La lista de alertas funciona como un registro operativo. Cada evento deja claro su severidad, procedencia y momento de detección.
              </p>
            </div>

            <div className="space-y-0">
              {activeAlerts.length === 0 ? (
                <div className="surface p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="space-y-3">
                      <p className="text-kicker text-success">Sin incidencias activas</p>
                      <h3 className="text-2xl tracking-[-0.04em]">Todo el sector está dentro de parámetros.</h3>
                      <p className="max-w-xl text-base leading-7 text-muted-foreground">
                        No hay reportes activos en el registro actual. El sistema sigue capturando nuevas lecturas cada cinco segundos.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              )}
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            <NeighborhoodMap alerts={alerts} />

            <div className="surface p-8">
              <p className="text-kicker">Lectura territorial</p>
              <div className="mt-6 space-y-5">
                <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-4">
                  <span className="text-sm text-muted-foreground">Alertas activas</span>
                  <span className="text-3xl font-semibold tracking-[-0.05em] text-foreground">{activeAlerts.length}</span>
                </div>
                <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-4">
                  <span className="text-sm text-muted-foreground">Críticas</span>
                  <span className="text-3xl font-semibold tracking-[-0.05em] text-critical">{stats.critical}</span>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Advertencias</span>
                  <span className="text-3xl font-semibold tracking-[-0.05em] text-warning">{stats.warning}</span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-16 border-t border-border/70 py-20 lg:grid-cols-[minmax(0,1.12fr)_0.88fr]">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-kicker">Series históricas</p>
              <h2 className="text-[clamp(2.2rem,4vw,3.75rem)] tracking-[-0.06em]">Contexto técnico de la lectura</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                El comportamiento reciente de gases, presión y altitud se presenta sobre superficies continuas para mantener foco en la señal y no en el contenedor.
              </p>
            </div>

            <SensorCharts history={sensorHistory} />
          </div>

          <div className="space-y-8">
            <div className="surface overflow-hidden">
              <div className="border-b border-border/70 px-8 py-7">
                <p className="text-kicker">Malla de continuidad</p>
                <h3 className="mt-3 text-3xl tracking-[-0.05em]">Nodos locales visibles</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  La red mesh mantiene trazabilidad básica incluso cuando el enlace principal se interrumpe.
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-border/70 hover:bg-transparent">
                    <TableHead className="px-8 py-5 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
                      Nodo / SSID
                    </TableHead>
                    <TableHead className="px-8 py-5 text-right font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
                      Señal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wifiNetworks.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={2} className="px-8 py-12 text-sm text-muted-foreground">
                        Aún no hay nodos reportados por la lectura actual.
                      </TableCell>
                    </TableRow>
                  ) : (
                    wifiNetworks.map((network, index) => {
                      const match = network.match(/(.*?)\s*\((.*?)\)/);
                      const ssid = match ? match[1].trim() : network;
                      const signal = match ? match[2].trim() : 'N/D';

                      return (
                        <TableRow key={`${ssid}-${index}`} className="border-border/70 hover:bg-black/[0.015]">
                          <TableCell className="px-8 py-5 text-base font-medium text-foreground">{ssid}</TableCell>
                          <TableCell className="px-8 py-5 text-right font-mono text-sm text-muted-foreground">{signal}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="surface p-8">
              <p className="text-kicker">Resumen operativo</p>
              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                  <span>Estado del enlace principal</span>
                  <span className="font-medium text-foreground">{connected ? 'Activo' : 'Pendiente'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                  <span>Histórico en memoria</span>
                  <span className="font-medium text-foreground">{sensorHistory.length} muestras</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Alertas resueltas</span>
                  <span className="font-medium text-foreground">{stats.resolved}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-16 border-t border-border/70 py-20 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="space-y-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-kicker">Respuesta y protocolo</p>
              <h2 className="text-[clamp(2.2rem,4vw,3.75rem)] tracking-[-0.06em]">Qué hacer cuando cambia el aire</h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                Las recomendaciones pasan a ser una guía operativa concreta y directa. Sin adornos, sin bloques redundantes.
              </p>
            </div>

            <SafetyTips alerts={alerts} sensors={sensors} thresholds={thresholds} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <div className="surface p-8">
              <p className="text-kicker">Números prioritarios</p>
              <h3 className="mt-3 text-3xl tracking-[-0.05em]">Contacto inmediato</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Accesos directos para incidentes de gas, fuego o afectación respiratoria.
              </p>
              <div className="mt-8">
                <EmergencyContacts />
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

'use client';

import { useAlerts } from '@/hooks/useAlerts';
import StatusHeader from '@/components/StatusHeader';
import SensorPanel from '@/components/SensorPanel';
import SafetyTips from '@/components/SafetyTips';
import AlertCard from '@/components/AlertCard';
import SensorCharts from '@/components/SensorCharts';
import RiskGauge from '@/components/RiskGauge';
import NeighborhoodMap from '@/components/NeighborhoodMap';
import EmergencyContacts from '@/components/EmergencyContacts';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const {
    alerts,
    sensors,
    sensorHistory,
    thresholds,
    resolveAlert,
    sirenActive,
    stats,
    connected,
    lastQueried,
  } = useAlerts();

  const activeAlerts = alerts.filter((a) => a.severity !== 'resolved');

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative' }}>
      {/* Dashboard content */}
      <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
        {/* ── 1. Status Header ── */}
        <StatusHeader
          connected={connected}
          stats={stats}
          lastQueried={lastQueried}
          sirenActive={sirenActive}
        />

        {/* ── 2. Safety Tips — prominent at top ── */}
        <SafetyTips alerts={alerts} sensors={sensors} thresholds={thresholds} />

        {/* ── 3. Sensor Panel — full width ── */}
        <SensorPanel
          sensors={sensors}
          connected={connected}
          thresholds={thresholds}
        />

        {/* ── 4. Main content: Alerts + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Alert Feed — 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                Feed de Alertas
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: connected === true ? 'var(--green)' : 'var(--text-3)',
                    animation: connected === true ? 'pulse-dot 2s ease-in-out infinite' : 'none',
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                  {connected === true ? 'Monitoreando' : 'Esperando conexión...'}
                </span>
              </div>
            </div>

            <div
              className="flex flex-col gap-3 overflow-y-auto pr-1"
              style={{ maxHeight: '460px' }}
            >
              {alerts.length === 0 ? (
                <div className="card p-12 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <AlertTriangle size={24} style={{ color: 'var(--text-3)' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-3)' }}>
                    Sin alertas activas
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-3)' }}>
                    {connected === false
                      ? 'Verificando conexión con InfluxDB...'
                      : 'Las alertas aparecerán aquí cuando los sensores detecten anomalías'}
                  </p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onResolve={resolveAlert} />
                ))
              )}
            </div>
          </div>

          {/* Right column: Risk Gauge + Map */}
          <div className="flex flex-col gap-5">
            <RiskGauge sensors={sensors} thresholds={thresholds} />
            <NeighborhoodMap alerts={alerts} />
          </div>
        </div>

        {/* ── 5. Charts — full width ── */}
        <SensorCharts history={sensorHistory} />

        {/* ── 6. Emergency Contacts ── */}
        <EmergencyContacts />

        {/* Footer */}
        <footer className="text-center py-3">
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            CanSat Control Center · Monitoreo Ambiental en Tiempo Real
            {activeAlerts.length > 0 && (
              <span style={{ color: 'var(--orange)' }}>
                {' '}· {activeAlerts.length} alerta{activeAlerts.length !== 1 ? 's' : ''} activa{activeAlerts.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </footer>
      </div>
    </div>
  );
}

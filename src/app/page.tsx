'use client';

import { useAlerts } from '@/hooks/useAlerts';
import AlertCard from '@/components/AlertCard';

import SendAlert from '@/components/SendAlert';
import NeighborhoodMap from '@/components/NeighborhoodMap';
import SensorPanel from '@/components/SensorPanel';

export default function Dashboard() {
  const { alerts, sensors, sendAlert, resolveAlert, sirenActive, stats, connected, lastQueried } = useAlerts();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Siren flash overlay */}
      {sirenActive && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'rgba(239, 68, 68, 0.06)',
            animation: 'pulse-dot 0.5s ease-in-out infinite',
          }}
        />
      )}

      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'var(--red-dim)', color: 'var(--red)' }}
          >
            ⚡
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--text)]">Sistema de Alertas Vecinal</h1>
            <p className="text-[10px] text-[var(--text-3)]">
              InfluxDB · Sensores en tiempo real
              {connected === true && <span style={{ color: 'var(--green)' }}> · Conectado</span>}
              {connected === false && <span style={{ color: 'var(--red)' }}> · Sin conexión</span>}
            </p>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-2">
          {[
            { label: 'Crítico', value: stats.critical, color: 'var(--red)', dim: 'var(--red-dim)' },
            { label: 'Advertencia', value: stats.warning, color: 'var(--orange)', dim: 'var(--orange-dim)' },
            { label: 'Resuelto', value: stats.resolved, color: 'var(--green)', dim: 'var(--green-dim)' },
            { label: 'Total', value: stats.total, color: 'var(--text-2)', dim: 'rgba(255,255,255,0.05)' },
          ].map(({ label, value, color, dim }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: dim, border: `1px solid ${color}22` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="mono text-[10px] font-medium" style={{ color }}>{value}</span>
              <span className="text-[10px] text-[var(--text-3)]">{label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Alert feed */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium text-[var(--text-2)]">Feed de Alertas</h2>
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: connected === true ? 'var(--green)' : 'var(--text-3)',
                  animation: connected === true ? 'pulse-dot 2s ease-in-out infinite' : 'none',
                }}
              />
              <span className="text-[10px] text-[var(--text-3)]">
                {connected === true ? 'Monitoreando' : 'Esperando conexión...'}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {alerts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-sm text-[var(--text-3)]">Sin alertas</p>
                <p className="text-[10px] text-[var(--text-3)] mt-1">
                  {connected === false
                    ? 'Verificando conexión con InfluxDB...'
                    : 'Las alertas aparecerán aquí cuando los sensores detecten anomalías'}
                </p>
              </div>
            )}
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onResolve={resolveAlert} />
            ))}
          </div>
        </div>

        {/* Right — Sidebar */}
        <div
          className="w-80 flex-shrink-0 overflow-y-auto p-5 flex flex-col gap-4"
          style={{ borderLeft: '1px solid var(--border)' }}
        >
          <SensorPanel sensors={sensors} connected={connected} lastQueried={lastQueried} />
          <SendAlert onSend={sendAlert} />

          <NeighborhoodMap alerts={alerts} />
        </div>
      </div>
    </div>
  );
}

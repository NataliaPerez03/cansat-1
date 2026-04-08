'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Flame, Heart, Shield, Wind } from 'lucide-react';
import { useMemo } from 'react';
import { type Alert, type SensorData, type Thresholds } from '@/hooks/useAlerts';

interface SafetyTipsProps {
  alerts: Alert[];
  sensors: SensorData;
  thresholds: Thresholds;
}

interface Tip {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  actions: string[];
  priority: number;
}

function getActiveTips(alerts: Alert[], sensors: SensorData, thresholds: Thresholds): Tip[] {
  const activeAlerts = alerts.filter((alert) => alert.severity === 'critical' || alert.severity === 'warning');
  const tips: Tip[] = [];

  const monoxide = sensors.Monoxido?.value;
  const monoxideThreshold = thresholds.Monoxido;
  const hasMonoxideAlert = activeAlerts.some(
    (alert) => alert.title.toLowerCase().includes('monóxido') || alert.title.toLowerCase().includes('co'),
  );

  if (hasMonoxideAlert && monoxide !== undefined && monoxideThreshold) {
    const isCritical = Number(monoxide) > monoxideThreshold.critical[1];

    tips.push({
      id: 'co',
      icon: <Wind size={20} strokeWidth={2.2} />,
      title: isCritical ? 'Peligro por gases tóxicos' : 'Calidad del aire comprometida',
      subtitle: `Concentración actual: ${Number(monoxide).toFixed(0)} ppm`,
      color: isCritical ? 'var(--critical)' : 'var(--warning)',
      priority: isCritical ? 1 : 2,
      actions: isCritical
        ? [
            'Cierra puertas y ventanas mientras defines una salida segura.',
            'Usa protección respiratoria si debes desplazarte por el sector.',
            'Reporta el punto exacto de concentración elevada al equipo de respuesta.',
          ]
        : [
            'Suspende actividad física al aire libre.',
            'Mantén ventilación cruzada en espacios interiores.',
            'Vuelve a verificar la siguiente lectura antes de retomar actividad normal.',
          ],
    });
  }

  const methane = sensors.metano?.value;
  const methaneThreshold = thresholds.metano;
  const hasMethaneAlert = activeAlerts.some((alert) => alert.title.toLowerCase().includes('metano'));

  if (hasMethaneAlert && methane !== undefined && methaneThreshold) {
    const isCritical = Number(methane) > methaneThreshold.critical[1];

    tips.push({
      id: 'metano',
      icon: <Flame size={20} strokeWidth={2.2} />,
      title: isCritical ? 'Riesgo de fuga inflamable' : 'Acumulación de metano',
      subtitle: `Nivel detectado: ${Number(methane).toFixed(0)} ppm`,
      color: isCritical ? 'var(--critical)' : 'var(--warning)',
      priority: isCritical ? 1 : 2,
      actions: isCritical
        ? [
            'Evita cualquier chispa, llama o manipulación eléctrica cercana.',
            'Despeja el área y activa la llamada a bomberos o servicio de gas.',
            'No regreses hasta confirmar dispersión y lectura estable.',
          ]
        : [
            'Ventila sótanos y zonas bajas donde el gas pueda concentrarse.',
            'Confirma si el olor persiste en la siguiente medición.',
            'Mantén una ruta de evacuación clara para la comunidad cercana.',
          ],
    });
  }

  return tips.sort((left, right) => left.priority - right.priority);
}

export default function SafetyTips({ alerts, sensors, thresholds }: SafetyTipsProps) {
  const tips = useMemo(() => getActiveTips(alerts, sensors, thresholds), [alerts, sensors, thresholds]);

  return (
    <AnimatePresence mode="wait">
      {tips.length === 0 ? (
        <motion.div
          key="safe"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="surface p-8 md:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex max-w-2xl items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <Shield size={20} />
              </div>
              <div className="space-y-3">
                <p className="text-kicker text-success">Condición segura</p>
                <h3 className="text-3xl tracking-[-0.05em]">No hay acciones urgentes en este momento.</h3>
                <p className="text-base leading-7 text-muted-foreground">
                  El sistema no detecta concentraciones peligrosas. Mantén el seguimiento rutinario y revisa de nuevo si cambia el estado general del tablero.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-success">
              <Heart size={14} />
              Operación estable
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {tips.map((tip) => (
            <motion.article
              key={tip.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface p-8 md:p-10"
            >
              <div className="space-y-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border"
                      style={{ borderColor: tip.color, color: tip.color }}
                    >
                      {tip.icon}
                    </div>
                    <div className="space-y-3">
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em]" style={{ color: tip.color }}>
                        Protocolo prioritario
                      </p>
                      <h3 className="text-3xl tracking-[-0.05em]">{tip.title}</h3>
                      <p className="text-base leading-7 text-muted-foreground">{tip.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {tip.actions.map((action) => (
                    <div key={action} className="border-t border-border/80 pt-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-primary">
                          <Check size={14} strokeWidth={2.5} />
                        </div>
                        <p className="text-sm leading-6 text-foreground/85">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

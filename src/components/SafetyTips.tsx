'use client';

import { Alert } from '@/hooks/useAlerts';
import { SensorData, Thresholds } from '@/hooks/useAlerts';
import { Shield, Wind, Flame, Thermometer, AlertTriangle, Heart } from 'lucide-react';
import { useMemo } from 'react';

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
    dim: string;
    actions: string[];
    priority: number;
}

function getActiveTips(alerts: Alert[], sensors: SensorData, thresholds: Thresholds): Tip[] {
    const activeAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'warning');
    const tips: Tip[] = [];
    const seen = new Set<string>();

    // Check CO levels
    const co = sensors['Monoxido']?.value;
    const coThreshold = thresholds['Monoxido'];
    const hasCOAlert = activeAlerts.some((a) => {
        const t = (a.title + a.description).toLowerCase();
        return t.includes('monóxido') || t.includes('monoxido') || t.includes(' co ');
    });

    if (hasCOAlert && co !== undefined && coThreshold && !seen.has('co')) {
        seen.add('co');
        const isCritical = co > coThreshold.critical[1];
        tips.push({
            id: 'co',
            icon: <Wind size={18} />,
            title: isCritical ? 'Nivel crítico de CO' : 'CO elevado en el aire',
            subtitle: `${co.toFixed(0)} ppm detectados`,
            color: isCritical ? 'var(--red)' : 'var(--orange)',
            dim: isCritical ? 'var(--red-dim)' : 'var(--orange-dim)',
            priority: isCritical ? 1 : 2,
            actions: isCritical
                ? [
                    'Evacúe el área inmediatamente',
                    'No use vehículos cerca de la zona',
                    'Llame a Bomberos (119) o Emergencias (123)',
                    'Ayude a personas mayores y niños a salir',
                ]
                : [
                    'Abra ventanas y puertas para ventilar',
                    'Evite ejercicio al aire libre',
                    'Personas con asma deben tomar precauciones',
                    'Esté atento a mareos o dolor de cabeza',
                ],
        });
    }

    // Check Metano levels
    const metano = sensors['metano']?.value;
    const metanoThreshold = thresholds['metano'];
    const hasMetanoAlert = activeAlerts.some((a) => {
        const t = (a.title + a.description).toLowerCase();
        return t.includes('metano') || t.includes('methane');
    });

    if (hasMetanoAlert && metano !== undefined && metanoThreshold && !seen.has('metano')) {
        seen.add('metano');
        const isCritical = metano > metanoThreshold.critical[1];
        tips.push({
            id: 'metano',
            icon: <Flame size={18} />,
            title: isCritical ? '¡Peligro! Gas Metano alto' : 'Metano elevado en la zona',
            subtitle: `${metano.toFixed(0)} ppm detectados`,
            color: isCritical ? 'var(--red)' : 'var(--orange)',
            dim: isCritical ? 'var(--red-dim)' : 'var(--orange-dim)',
            priority: isCritical ? 1 : 2,
            actions: isCritical
                ? [
                    'No encienda fósforos ni interruptores eléctricos',
                    'Evacúe la zona caminando, sin correr',
                    'Llame a la empresa de gas (164)',
                    'No regrese hasta que las autoridades lo indiquen',
                ]
                : [
                    'Ventile abriendo puertas y ventanas',
                    'Apague aparatos de combustión',
                    'No encienda fuego ni fume',
                    'Esté pendiente si el nivel sube',
                ],
        });
    }

    // Check Temperature
    const temp = sensors['Temperatura']?.value;
    const tempThreshold = thresholds['Temperatura'];
    const hasTempAlert = activeAlerts.some((a) => {
        const t = (a.title + a.description).toLowerCase();
        return t.includes('temperatura');
    });

    if (hasTempAlert && temp !== undefined && tempThreshold && !seen.has('temp')) {
        seen.add('temp');
        tips.push({
            id: 'temp',
            icon: <Thermometer size={18} />,
            title: temp > tempThreshold.warning[1] ? 'Calor excesivo' : 'Temperatura muy baja',
            subtitle: `${temp.toFixed(1)}°C registrados`,
            color: 'var(--yellow)',
            dim: 'var(--yellow-dim)',
            priority: 3,
            actions:
                temp > tempThreshold.warning[1]
                    ? [
                        'Manténgase hidratado',
                        'Busque sombra y espacios frescos',
                        'Proteja a niños y adultos mayores',
                        'Evite actividad física intensa',
                    ]
                    : [
                        'Abríguese bien al salir',
                        'Proteja a personas vulnerables del frío',
                        'Revise calefacción si la usa',
                        'Evite hipotermia por exposición prolongada',
                    ],
        });
    }

    // Check for impact/seismic
    const hasImpact = activeAlerts.some((a) => {
        const t = (a.title + a.description).toLowerCase();
        return t.includes('impacto') || t.includes('caída') || t.includes('aceleración');
    });

    if (hasImpact && !seen.has('impact')) {
        seen.add('impact');
        tips.push({
            id: 'impact',
            icon: <AlertTriangle size={18} />,
            title: 'Movimiento brusco detectado',
            subtitle: 'Posible impacto o sismo',
            color: 'var(--red)',
            dim: 'var(--red-dim)',
            priority: 1,
            actions: [
                'Mantenga la calma',
                'Aléjese de ventanas y objetos altos',
                'Ubíquese en un lugar seguro',
                'Siga el protocolo de evacuación si es necesario',
            ],
        });
    }

    // Sort by priority (most urgent first)
    tips.sort((a, b) => a.priority - b.priority);
    return tips;
}

export default function SafetyTips({ alerts, sensors, thresholds }: SafetyTipsProps) {
    const tips = useMemo(() => getActiveTips(alerts, sensors, thresholds), [alerts, sensors, thresholds]);

    // No alerts: show a compact "all clear" banner
    if (tips.length === 0) {
        return (
            <div
                className="card flex items-center gap-4 px-5 py-4"
                style={{ borderLeft: '3px solid var(--green)' }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--green-dim)', color: 'var(--green)' }}
                >
                    <Shield size={18} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                        ✅ Ambiente seguro — Sin alertas activas
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                        Los niveles de gases y condiciones ambientales están dentro de los rangos normales para la comunidad.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0" style={{ color: 'var(--green)' }}>
                    <Heart size={14} />
                    <span className="text-xs font-medium">Aire limpio</span>
                </div>
            </div>
        );
    }

    // Active alerts: show tips prominently
    return (
        <div className="flex flex-col gap-3">
            <div
                className="grid gap-3"
                style={{
                    gridTemplateColumns: tips.length === 1 ? '1fr' : `repeat(${Math.min(tips.length, 3)}, 1fr)`,
                }}
            >
                {tips.map((tip) => (
                    <div
                        key={tip.id}
                        className="card animate-fade-in-up"
                        style={{
                            padding: '20px',
                            borderLeft: `3px solid ${tip.color}`,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Background glow */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100px',
                                height: '100px',
                                background: `radial-gradient(circle, ${tip.color}06 0%, transparent 70%)`,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Header row */}
                        <div className="flex items-center gap-3 mb-2.5" style={{ position: 'relative' }}>
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: tip.dim, color: tip.color }}
                            >
                                {tip.icon}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                                    {tip.title}
                                </h3>
                                <span className="text-[11px] mono font-medium" style={{ color: tip.color }}>
                                    {tip.subtitle}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1.5" style={{ position: 'relative' }}>
                            <span
                                className="text-[9px] font-bold uppercase tracking-widest mb-0.5"
                                style={{ color: tip.color }}
                            >
                                ¿Qué debe hacer?
                            </span>
                            {tip.actions.map((action, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span
                                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5"
                                        style={{ background: tip.dim, color: tip.color }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="text-xs leading-snug" style={{ color: 'var(--text-2)' }}>
                                        {action}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

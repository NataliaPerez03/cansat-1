'use client';

import { Severity } from '@/hooks/useAlerts';

interface QuickAlert {
    label: string;
    icon: string;
    severity: Severity;
    title: string;
    description: string;
}

const presets: QuickAlert[] = [
    { label: 'Incendio', icon: '🔥', severity: 'critical', title: 'Emergencia de Incendio', description: 'Incendio reportado en el vecindario. Evacúe el área inmediatamente y llame al 911.' },
    { label: 'Inundación', icon: '🌊', severity: 'critical', title: 'Alerta de Inundación', description: 'Niveles de agua elevados detectados. Diríjase a terreno elevado inmediatamente.' },
    { label: 'Robo', icon: '🚨', severity: 'critical', title: 'Robo Reportado', description: 'Entrada no autorizada reportada. Asegure puertas y contacte a las autoridades.' },
    { label: 'Médica', icon: '🏥', severity: 'warning', title: 'Emergencia Médica', description: 'Emergencia médica en curso. Los paramédicos han sido notificados.' },
    { label: 'Apagón', icon: '⚡', severity: 'info', title: 'Corte de Energía', description: 'Corte de energía eléctrica en el área. La empresa de servicios ha sido notificada.' },
    { label: 'Mascota', icon: '🐾', severity: 'info', title: 'Mascota Perdida', description: 'Se ha reportado una mascota perdida. Por favor esté atento en su área.' },
];

interface QuickAlertsProps {
    onSend: (alert: { title: string; description: string; severity: Severity; zone: string; source: string }) => void;
}

export default function QuickAlerts({ onSend }: QuickAlertsProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">
                Alertas Rápidas
            </h2>

            <div className="grid grid-cols-3 gap-3">
                {presets.map((p) => (
                    <button
                        key={p.label}
                        onClick={() => onSend({ title: p.title, description: p.description, severity: p.severity, zone: 'Mi Zona', source: 'Reporte Manual' })}
                        className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl bg-slate-50 border border-slate-200 transition-all cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                        <span className="text-2xl drop-shadow-sm">{p.icon}</span>
                        <span className="text-[11px] font-bold text-slate-700 tracking-wide">
                            {p.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
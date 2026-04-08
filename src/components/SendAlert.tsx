'use client';

import { useState } from 'react';
import { Severity } from '@/hooks/useAlerts';

interface SendAlertProps {
    onSend: (alert: { title: string; description: string; severity: Severity; zone: string; source: string }) => void;
}

export default function SendAlert({ onSend }: SendAlertProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [severity, setSeverity] = useState<Severity>('warning');
    const [zone, setZone] = useState('Mi Zona');

    const submit = () => {
        if (!title.trim()) return;
        onSend({ title, description: desc, severity, zone, source: 'Reporte Manual' });
        setTitle('');
        setDesc('');
        setOpen(false);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="w-full py-4 rounded-xl text-base font-bold uppercase tracking-wider transition-all cursor-pointer bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 active:scale-[0.98] shadow-sm"
            >
                + Crear Alerta Manual
            </button>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md animate-slide-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Nueva Alerta</h2>
                <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                >
                    ✕
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {/* Título */}
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título de la alerta..."
                    className="w-full px-4 py-3.5 rounded-xl text-base font-medium text-slate-800 bg-slate-50 border border-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />

                {/* Descripción */}
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describa la situación detalladamente..."
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl text-base font-medium text-slate-800 bg-slate-50 border border-slate-200 placeholder:text-slate-400 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />

                {/* Nivel de Severidad */}
                <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Nivel de Severidad</span>
                    <div className="flex gap-3">
                        {(['critical', 'warning', 'info'] as Severity[]).map((s) => {
                            const bgColors: Record<string, string> = { critical: 'bg-red-50', warning: 'bg-amber-50', info: 'bg-blue-50' };
                            const textColors: Record<string, string> = { critical: 'text-red-600', warning: 'text-amber-600', info: 'text-blue-600' };
                            const borderColors: Record<string, string> = { critical: 'border-red-200', warning: 'border-amber-200', info: 'border-blue-200' };
                            const labels: Record<string, string> = { critical: 'Crítico', warning: 'Advertencia', info: 'Info' };

                            const isSelected = severity === s;

                            return (
                                <button
                                    key={s}
                                    onClick={() => setSeverity(s)}
                                    className={`flex-1 text-sm font-bold py-3 rounded-xl transition-all cursor-pointer uppercase tracking-wider border ${isSelected
                                            ? `${bgColors[s]} ${textColors[s]} ${borderColors[s]} shadow-sm`
                                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    {labels[s]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Zona */}
                <input
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Zona / Área afectada"
                    className="w-full px-4 py-3.5 rounded-xl text-base font-medium text-slate-800 bg-slate-50 border border-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />

                {/* Botón de Enviar */}
                <button
                    onClick={submit}
                    className="w-full py-4 mt-2 rounded-xl text-base font-bold uppercase tracking-wider text-white bg-red-600 border border-red-700 shadow-sm transition-all hover:bg-red-700 cursor-pointer active:scale-[0.98]"
                >
                    Transmitir Alerta
                </button>
            </div>
        </div>
    );
}
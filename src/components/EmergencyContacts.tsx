'use client';

import { Phone, Siren, Flame, Cross, Shield, Zap, HelpCircle } from 'lucide-react';

interface Contact {
    name: string;
    number: string;
    icon: React.ReactNode;
    color: string;
    dim: string;
    description: string;
}

const EMERGENCY_CONTACTS: Contact[] = [
    {
        name: 'Línea de Emergencias',
        number: '123',
        icon: <Siren size={20} />,
        color: 'var(--red)',
        dim: 'var(--red-dim)',
        description: 'Policía, Bomberos y Ambulancia',
    },
    {
        name: 'Bomberos',
        number: '119',
        icon: <Flame size={20} />,
        color: 'var(--orange)',
        dim: 'var(--orange-dim)',
        description: 'Incendios, fugas de gas, rescates',
    },
    {
        name: 'Cruz Roja',
        number: '132',
        icon: <Cross size={20} />,
        color: 'var(--red)',
        dim: 'var(--red-dim)',
        description: 'Emergencias médicas',
    },
    {
        name: 'Defensa Civil',
        number: '144',
        icon: <Shield size={20} />,
        color: 'var(--blue)',
        dim: 'var(--blue-dim)',
        description: 'Desastres naturales, evacuación',
    },
    {
        name: 'Empresa de Gas',
        number: '164',
        icon: <Zap size={20} />,
        color: 'var(--yellow)',
        dim: 'var(--yellow-dim)',
        description: 'Fugas y emergencias de gas natural',
    },
    {
        name: 'Línea Ambiental',
        number: '148',
        icon: <HelpCircle size={20} />,
        color: 'var(--green)',
        dim: 'var(--green-dim)',
        description: 'Denuncias ambientales',
    },
];

export default function EmergencyContacts() {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
                <Phone size={16} style={{ color: 'var(--red)' }} />
                <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                    Números de Emergencia
                </h2>
            </div>

            <div className="card p-5" style={{ overflow: 'hidden', position: 'relative' }}>
                {/* Subtle emergency background */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(255,77,106,0.03) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" style={{ position: 'relative' }}>
                    {EMERGENCY_CONTACTS.map((contact) => (
                        <div
                            key={contact.number}
                            className="flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{
                                background: 'var(--bg-raised)',
                                border: '1px solid var(--border)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${contact.color}30`;
                                e.currentTarget.style.background = `${contact.dim}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.background = 'var(--bg-raised)';
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: contact.dim, color: contact.color }}
                            >
                                {contact.icon}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                        {contact.name}
                                    </span>
                                </div>
                                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>
                                    {contact.description}
                                </p>
                            </div>

                            {/* Phone number */}
                            <div
                                className="mono text-lg font-bold flex-shrink-0 px-3 py-1.5 rounded-lg"
                                style={{
                                    color: contact.color,
                                    background: contact.dim,
                                }}
                            >
                                {contact.number}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer tip */}
                <div
                    className="flex items-center gap-2 mt-4 pt-3"
                    style={{ borderTop: '1px solid var(--border)' }}
                >
                    <span className="text-lg">📋</span>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                        Guarde estos números en su teléfono. En caso de emergencia, mantenga la calma y proporcione su ubicación exacta.
                    </p>
                </div>
            </div>
        </div>
    );
}

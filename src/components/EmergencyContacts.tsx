'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, HeartPulse, Phone, ShieldAlert } from 'lucide-react';

const contacts = [
  {
    name: 'Línea única',
    number: '123',
    description: 'Emergencias generales',
    icon: Phone,
  },
  {
    name: 'Bomberos Bogotá',
    number: '119',
    description: 'Incendios o fuga',
    icon: Flame,
  },
  {
    name: 'Vanti',
    number: '164',
    description: 'Reporte de gas',
    icon: ShieldAlert,
  },
  {
    name: 'Cruz Roja / Salud',
    number: '132',
    description: 'Atención médica',
    icon: HeartPulse,
  },
];

export default function EmergencyContacts() {
  return (
    <div className="divide-y divide-border/80">
      {contacts.map((contact, index) => {
        const Icon = contact.icon;

        return (
          <motion.a
            key={contact.number}
            href={`tel:${contact.number}`}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
            className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 first:pt-0 hover:translate-x-1 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-primary">
                <Icon size={18} strokeWidth={2.2} />
              </div>

              <div>
                <p className="text-kicker">{contact.description}</p>
                <p className="mt-2 text-lg font-medium tracking-[-0.03em] text-foreground">{contact.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold tracking-[-0.05em] text-foreground">{contact.number}</span>
              <ArrowUpRight size={16} className="text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}

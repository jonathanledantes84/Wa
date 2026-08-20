import React, { useState } from 'react';
import {
  Building2,
  Users,
  Activity,
  Radio,
  Cpu,
  Monitor,
  CheckCircle2,
  Coffee,
  MessageSquare,
  ShieldCheck,
  Zap,
  PhoneCall
} from 'lucide-react';
import { Agent, VirtualOfficeRoom } from '../types';

interface VirtualOfficeViewProps {
  agents: Agent[];
  currentAgent: Agent;
}

export const VirtualOfficeView: React.FC<VirtualOfficeViewProps> = ({ agents }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('sales_floor');

  const officeRooms: VirtualOfficeRoom[] = [
    {
      id: 'executive',
      name: 'Directorio C-Suite Virtual',
      type: 'executive',
      capacity: 4,
      activeAgents: ['Elena Rostova (CEO)', 'Camila Morales (CFO)'],
      currentActivity: 'Análisis de presupuesto Q4 y proyecciones de EBITDA.',
      statusColor: '#8b5cf6'
    },
    {
      id: 'sales_floor',
      name: 'Piso de Ventas & WhatsApp WABA',
      type: 'sales_floor',
      capacity: 12,
      activeAgents: ['Sofía Martínez', 'Carlos Rodríguez', 'Mateo Rossi'],
      currentActivity: 'Atención activa de 42 chats entrantes de Meta Ads.',
      statusColor: '#10b981'
    },
    {
      id: 'dev_lab',
      name: 'Laboratorio de IA & Integraciones',
      type: 'dev_lab',
      capacity: 6,
      activeAgents: ['Siddharth Patel (CTO)', 'Bot Copilot TS'],
      currentActivity: 'Despliegue de webhooks ERPNext y pruebas de latencia.',
      statusColor: '#3b82f6'
    },
    {
      id: 'support_center',
      name: 'Centro de Soporte & Handover',
      type: 'support_center',
      capacity: 8,
      activeAgents: ['Lucía Gómez', 'Bot Auto-Handover'],
      currentActivity: 'Resolución de tickets de facturación y soporte técnico.',
      statusColor: '#f59e0b'
    },
    {
      id: 'lounge',
      name: 'Lounge Virtual & Brainstorming',
      type: 'lounge',
      capacity: 10,
      activeAgents: ['Marcos Benítez (CMO)'],
      currentActivity: 'Diseño de copys para campaña de difusiones WABA.',
      statusColor: '#64748b'
    }
  ];

  const selectedRoom = officeRooms.find((r) => r.id === selectedRoomId) || officeRooms[1];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-emerald-600" />
            <span>Virtual Office 2D (Oficina Virtual Interactiva)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Plano interactivo en tiempo real con distribución de agentes, salas operativas y estado de trabajo.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {agents.length} Agentes Activos en Piso
          </span>
        </div>
      </div>

      {/* 2D INTERACTIVE FLOORPLAN MAP */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 text-white relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-2">
            <Radio className="w-4 h-4 animate-ping" />
            CLIENTUM VIRTUAL FLOORPLAN • TOWER A
          </span>
          <span className="text-xs text-slate-400 font-mono">Presioná cualquier sala para ver detalles</span>
        </div>

        {/* Floorplan Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[280px]">
          {officeRooms.map((room) => {
            const isSelected = room.id === selectedRoomId;

            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 relative group ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 shadow-lg ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition">
                    {room.name}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full border border-slate-900 shadow-xs"
                    style={{ backgroundColor: room.statusColor }}
                  />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{room.currentActivity}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>{room.activeAgents.length} presentes</span>
                  <span className="text-emerald-400 font-bold">Ocupado</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ROOM DETAIL & AGENT ROSTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Room Details */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Detalle de Sala: {selectedRoom.name}</span>
              </h2>
              <p className="text-xs text-slate-500">{selectedRoom.currentActivity}</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg">
              Capacidad: {selectedRoom.capacity} puestos
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Agentes en Puesto:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedRoom.activeAgents.map((agName, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900">{agName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">En Llamada / Chat</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Agent Status Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Estado del Equipo</span>
            </h2>
            <p className="text-xs text-slate-500">Métricas de disponibilidad en tiempo real.</p>
          </div>

          <div className="space-y-3">
            {agents.map((ag) => (
              <div key={ag.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={ag.avatar} alt={ag.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{ag.name}</p>
                    <p className="text-[10px] text-slate-500">{ag.role}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  Online
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

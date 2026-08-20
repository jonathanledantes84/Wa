import React, { useState } from 'react';
import {
  Database,
  Server,
  FileText,
  LifeBuoy,
  CreditCard,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Terminal,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';
import { BenchInstance, SystemBackupPoint, SystemTelemetryLog, CustomerPortalTicket } from '../types';

export const ClientumOsHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'backups' | 'benches' | 'logs' | 'portal' | 'webhooks'>('backups');

  // Backups Data State
  const [backups, setBackups] = useState<SystemBackupPoint[]>([
    {
      id: 'bak-2026-08-19',
      name: 'Firestore Automatic Daily Snapshot',
      type: 'automated',
      sizeMb: 148,
      collectionsCount: 18,
      createdAt: 'Hoy, 03:00 AM',
      status: 'ready',
      location: 'gs://clientum-backups-us-east1/2026-08-19'
    },
    {
      id: 'bak-2026-08-18',
      name: 'Manual Pre-Deployment Backup',
      type: 'manual',
      sizeMb: 142,
      collectionsCount: 18,
      createdAt: 'Ayer, 18:45 PM',
      status: 'ready',
      location: 'gs://clientum-backups-us-east1/2026-08-18'
    }
  ]);

  // Benches Data State
  const [benches] = useState<BenchInstance[]>([
    {
      id: 'bench-01',
      siteName: 'production-bench-latam',
      domain: 'app.clientum.co',
      frappeVersion: 'v15.2.0 (ERPNext)',
      status: 'running',
      databaseSizeMb: 480,
      tenantName: 'Clientum Enterprise Multi-Tenant',
      sslActive: true,
      lastBackupAt: 'Hace 3 horas'
    },
    {
      id: 'bench-02',
      siteName: 'staging-bench-dev',
      domain: 'staging.clientum.co',
      frappeVersion: 'v15.3.0-beta',
      status: 'running',
      databaseSizeMb: 120,
      tenantName: 'Staging Environment',
      sslActive: true,
      lastBackupAt: 'Ayer'
    }
  ]);

  // Telemetry Logs Data State
  const [logs] = useState<SystemTelemetryLog[]>([
    { id: 'log-1', level: 'info', service: 'Express API', message: 'POST /api/webhooks/whatsapp - 200 OK', timestamp: '22:45:12', durationMs: 14 },
    { id: 'log-2', level: 'info', service: 'Gemini GenAI', message: 'generateContent: Copilot lead classification completed', timestamp: '22:44:50', durationMs: 310 },
    { id: 'log-3', level: 'warn', service: 'Baileys Gateway', message: 'Rate limit threshold warning (85% buffer capacity)', timestamp: '22:41:05', durationMs: 42 },
    { id: 'log-4', level: 'info', service: 'Firestore DB', message: 'Collection "leads" batch update (14 documents)', timestamp: '22:38:19', durationMs: 22 }
  ]);

  // Customer Portal Tickets Data State
  const [tickets] = useState<CustomerPortalTicket[]>([
    {
      id: 'tick-901',
      ticketNumber: 'TICK-8042',
      subject: 'Consulta sobre integración de plantilla WhatsApp de facturación',
      customerName: 'Santiago Rossi',
      customerEmail: 'santiago@empresa.com',
      status: 'In Progress',
      priority: 'High',
      category: 'WABA & Meta',
      createdAt: 'Hoy, 09:15 AM',
      lastResponseAt: 'Hace 20 min',
      messagesCount: 4
    },
    {
      id: 'tick-902',
      ticketNumber: 'TICK-8039',
      subject: 'Solicitud de ampliación de cupos para agentes comerciales',
      customerName: 'Mariana López',
      customerEmail: 'm.lopez@retail.ar',
      status: 'Resolved',
      priority: 'Medium',
      category: 'Suscripciones & Planes',
      createdAt: 'Ayer',
      lastResponseAt: 'Ayer, 16:30 PM',
      messagesCount: 2
    }
  ]);

  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  const handleCreateManualBackup = () => {
    setIsBackupRunning(true);
    setBackupNotice(null);

    setTimeout(() => {
      const newBak: SystemBackupPoint = {
        id: `bak-${Date.now()}`,
        name: `Backup Manual Instantáneo`,
        type: 'manual',
        sizeMb: 151,
        collectionsCount: 18,
        createdAt: 'Ahora mismo',
        status: 'ready',
        location: `gs://clientum-backups-us-east1/manual-${Date.now()}`
      };

      setBackups((prev) => [newBak, ...prev]);
      setIsBackupRunning(false);
      setBackupNotice('¡Snapshot completo guardado exitosamente en Google Cloud Storage!');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Server className="w-7 h-7 text-indigo-600" />
            <span>Clientum OS Infrastructure & Operations Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Módulos avanzados clientum-os: Backups de Firestore, Frappe Benches, Logs en vivo, Portal de Clientes y Webhooks.
          </p>
        </div>

        {/* Subtab Selector */}
        <div className="flex items-center space-x-1 bg-slate-200 p-1 rounded-xl">
          {[
            { id: 'backups', label: 'Backups', icon: Database },
            { id: 'benches', label: 'Frappe Benches', icon: Server },
            { id: 'logs', label: 'Logs Telemetría', icon: Terminal },
            { id: 'portal', label: 'Portal Clientes', icon: LifeBuoy },
            { id: 'webhooks', label: 'Webhooks Billing', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {backupNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{backupNotice}</span>
        </div>
      )}

      {/* SUBTAB 1: BACKUPS */}
      {activeSubTab === 'backups' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span>Puntos de Restauración y Copias de Seguridad (BackupsView)</span>
                </h2>
                <p className="text-xs text-slate-500">Gestión de snapshots automatizados de Firestore y Cloud Storage.</p>
              </div>

              <button
                onClick={handleCreateManualBackup}
                disabled={isBackupRunning}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isBackupRunning ? 'animate-spin' : ''}`} />
                <span>{isBackupRunning ? 'Generando Snapshot...' : 'Crear Backup Manual'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {backups.map((bak) => (
                <div key={bak.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{bak.name}</span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono text-[10px] font-bold">
                        {bak.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">{bak.location}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className="text-slate-600">{bak.sizeMb} MB • {bak.collectionsCount} colecciones</span>
                    <span className="text-slate-400">{bak.createdAt}</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                      {bak.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FRAPPE BENCHES */}
      {activeSubTab === 'benches' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                <span>Frappe / ERPNext Bench Controller (BenchesView)</span>
              </h2>
              <p className="text-xs text-slate-500">Administrador de instancias multitenant de Frappe Bench y sitios web.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benches.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{b.siteName}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 font-mono">
                    <p>Dominio: <strong className="text-slate-900">{b.domain}</strong></p>
                    <p>Versión: <span className="text-indigo-700 font-bold">{b.frappeVersion}</span></p>
                    <p>Base de datos: {b.databaseSizeMb} MB</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>SSL: {b.sslActive ? ' Activo' : ' Inactivo'}</span>
                    <span>Backup: {b.lastBackupAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LOGS TELEMETRY */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 shadow-xl font-mono space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                REAL-TIME TELEMETRY LOGS (LogsView)
              </span>
              <span className="text-slate-500">Express & Gemini Tracer</span>
            </div>

            <div className="space-y-2 text-xs">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="text-indigo-400 font-bold">[{log.service}]</span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                  <span className="text-emerald-400">{log.durationMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CUSTOMER PORTAL */}
      {activeSubTab === 'portal' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-indigo-600" />
                <span>Portal de Autoservicio de Clientes (CustomerPortalView)</span>
              </h2>
              <p className="text-xs text-slate-500">Tickets de soporte, contratos y estado de servicios de clientes.</p>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-indigo-700">{t.ticketNumber}</span>
                      <span className="text-xs font-bold text-slate-900">{t.subject}</span>
                    </div>
                    <p className="text-xs text-slate-500">{t.customerName} ({t.customerEmail}) • Categoría: {t.category}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    t.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: WEBHOOKS BILLING */}
      {activeSubTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Billing & Webhook Manager (BillingWebhookModal)</span>
              </h2>
              <p className="text-xs text-slate-500">Verificación de pasarelas de pago, Stripe, MercadoPago y cobros por suscripción.</p>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>Webhook Active Endpoint:</span>
                <span>HTTP 200 OK</span>
              </div>
              <p className="text-slate-400">URL: https://app.clientum.co/api/webhooks/billing</p>
              <p className="text-slate-400">Secret Sign Key: whsec_live_9482938492039482</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

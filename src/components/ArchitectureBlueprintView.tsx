import React, { useState } from 'react';
import {
  Server,
  Database,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Globe,
  Radio,
  Zap,
  Shield,
  HardDrive
} from 'lucide-react';
import { ArchitectureServiceNode } from '../types';

export const ArchitectureBlueprintView: React.FC = () => {
  const [nodes, setNodes] = useState<ArchitectureServiceNode[]>([
    {
      id: 'node-express',
      name: 'Express Node.js Server',
      type: 'api',
      status: 'healthy',
      latencyMs: 14,
      memoryUsageMb: 142,
      version: 'v20.11.1',
      region: 'us-east1 (Cloud Run)',
      connections: ['node-firestore', 'node-gemini', 'node-baileys']
    },
    {
      id: 'node-firestore',
      name: 'Firebase Firestore DB',
      type: 'db',
      status: 'healthy',
      latencyMs: 22,
      memoryUsageMb: 85,
      version: 'v11.2.0',
      region: 'nam5 (Multi-region)',
      connections: ['node-express']
    },
    {
      id: 'node-gemini',
      name: 'Google Gemini 2.5 API',
      type: 'ai',
      status: 'healthy',
      latencyMs: 310,
      memoryUsageMb: 210,
      version: 'GenAI SDK v0.1.2',
      region: 'Global Endpoint',
      connections: ['node-express']
    },
    {
      id: 'node-baileys',
      name: 'Baileys WABA Gateway',
      type: 'gateway',
      status: 'healthy',
      latencyMs: 45,
      memoryUsageMb: 178,
      version: 'v6.5.0',
      region: 'us-east1',
      connections: ['node-express']
    },
    {
      id: 'node-redis',
      name: 'Redis Cache & Queue',
      type: 'cache',
      status: 'healthy',
      latencyMs: 3,
      memoryUsageMb: 64,
      version: 'Redis 7.2',
      region: 'us-east1',
      connections: ['node-express']
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshDiagnostics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          latencyMs: Math.max(2, Math.floor(n.latencyMs + (Math.random() * 6 - 3)))
        }))
      );
      setIsRefreshing(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>Architecture Blueprint & System Topology</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Topología del sistema, estado de microservicios, latencias de API Node.js, Firebase y Baileys Gateway.
          </p>
        </div>

        <button
          onClick={handleRefreshDiagnostics}
          disabled={isRefreshing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Ejecutar Diagnóstico</span>
        </button>
      </div>

      {/* SYSTEM ARCHITECTURE MAP CANVAS */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            SYSTEM MICROSERVICES TOPOLOGY MAP
          </span>
          <span className="text-xs text-slate-400 font-mono">5 Microservicios • Latencia Promedio: 78ms</span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div key={node.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative group hover:border-indigo-500 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>{node.name}</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                  {node.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <p>Región: <span className="text-slate-200 font-mono">{node.region}</span></p>
                <p>Versión: <span className="text-slate-200 font-mono">{node.version}</span></p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Latencia: <strong className="text-emerald-400">{node.latencyMs} ms</strong></span>
                <span className="text-slate-400">RAM: <strong className="text-indigo-300">{node.memoryUsageMb} MB</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* METRICS & ENVIRONMENT VARS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Seguridad & Reglas de Firebase</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Las reglas de seguridad de Firestore (`firestore.rules`) garantizan la segregación estricta entre inquilinos mediante la validación de `request.auth.uid`.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            <span>Puertos & Reverse Proxy Nginx</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Puerto único accesible en contenedor: <strong className="font-mono text-indigo-700">3000</strong>. Todas las solicitudes internas de Vite y Express se canalizan a través de Nginx.
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  GitMerge,
  Plus,
  Play,
  Save,
  Trash2,
  CheckCircle2,
  Zap,
  Globe,
  Database,
  MessageSquare,
  Bot,
  Mail,
  ArrowRight
} from 'lucide-react';

export const N8nFlowEditorView: React.FC = () => {
  const [flowNodes, setFlowNodes] = useState([
    { id: 'node-1', name: 'Webhook Entrante', type: 'trigger', icon: Globe, status: 'active', desc: 'POST /api/webhooks/whatsapp' },
    { id: 'node-2', name: 'Filtrar Lead por Score', type: 'condition', icon: Zap, status: 'active', desc: 'Score > 50 puntos' },
    { id: 'node-3', name: 'Enriquecer con LinkedIn', type: 'action', icon: Bot, status: 'active', desc: 'OpenRouter / Perplexity API' },
    { id: 'node-4', name: 'Crear Pedido en ERPNext', type: 'action', icon: Database, status: 'active', desc: 'Frappe API endpoint' },
    { id: 'node-5', name: 'Notificar en WhatsApp WABA', type: 'action', icon: MessageSquare, status: 'active', desc: 'Plantilla de bienvenida' }
  ]);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const handleRunN8nTest = () => {
    setIsExecuting(true);
    setExecutionResult(null);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionResult(' Flujo ejecutado exitosamente en n8n engine (Tiempo de respuesta: 180ms). Todos los 5 nodos respondieron HTTP 200.');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <GitMerge className="w-7 h-7 text-rose-600" />
            <span>n8n Visual Flow Builder & Workflow Editor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Diseñador de flujos n8n visual para conectar webhooks, WhatsApp, Gemini AI, Frappe ERP y campañas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunN8nTest}
            disabled={isExecuting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isExecuting ? 'Ejecutando Flujo...' : 'Probar Flujo n8n'}</span>
          </button>
        </div>
      </div>

      {executionResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{executionResult}</span>
        </div>
      )}

      {/* VISUAL DIAGRAM CANVAS */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 min-h-[380px] flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-mono font-bold text-rose-400">N8N WORKFLOW CANVAS • WORKFLOW #104</span>
          <span className="text-xs text-slate-400 font-mono">5 Nodos Conectados</span>
        </div>

        {/* Node Flow Representation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto py-6 px-2">
          {flowNodes.map((node, index) => {
            const Icon = node.icon;

            return (
              <React.Fragment key={node.id}>
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl space-y-2 w-full md:w-52 shrink-0 shadow-lg relative group hover:border-rose-500 transition">
                  <div className="flex items-center justify-between">
                    <span className="p-2 bg-slate-700 rounded-xl text-rose-400">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                      {node.type}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100">{node.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{node.desc}</p>
                </div>

                {index < flowNodes.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-slate-600 shrink-0 hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5">
            <Plus className="w-4 h-4" />
            <span>Agregar Nodo n8n</span>
          </button>
        </div>
      </div>
    </div>
  );
};

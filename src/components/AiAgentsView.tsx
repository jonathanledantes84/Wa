import React, { useState } from 'react';
import {
  Bot,
  Zap,
  Search,
  Globe,
  Briefcase,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Cpu,
  Layers,
  Terminal,
  Database,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Agent, EnrichmentLog } from '../types';

interface AiAgentsViewProps {
  agents: Agent[];
  currentAgent: Agent;
}

export const AiAgentsView: React.FC<AiAgentsViewProps> = ({ agents, currentAgent }) => {
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>('all');
  const [enrichmentTarget, setEnrichmentTarget] = useState<string>('contacto@empresa.com');
  const [companyName, setCompanyName] = useState<string>('TechCorp Latam');
  const [isEnriching, setIsEnriching] = useState<boolean>(false);

  const [enrichmentLogs, setEnrichmentLogs] = useState<EnrichmentLog[]>([
    {
      id: 'en-101',
      targetEmail: 'carlos.m@fintech.co',
      companyName: 'Fintech Solutions',
      linkedinUrl: 'https://linkedin.com/in/carlos-m',
      status: 'completed',
      dataPointsFound: 14,
      provider: 'LinkedIn API',
      timestamp: 'Hace 12 min',
      summary: 'VP de Operaciones • $12M en rondas Serie A • stack: React, Node.js, Python • 120 empleados.'
    },
    {
      id: 'en-102',
      targetEmail: 'valeria.tech@agritech.ar',
      companyName: 'Agritech Argentina',
      linkedinUrl: 'https://linkedin.com/in/valeria-agri',
      status: 'completed',
      dataPointsFound: 9,
      provider: 'Perplexity',
      timestamp: 'Hace 45 min',
      summary: 'Directora de Compras • Presupuesto anual $450k • Interesados en automatización WABA WABA.'
    }
  ]);

  const toolsList = [
    { name: 'linkedin_enrichment', category: 'Enrichment', description: 'Extrae perfil profesional, cargo, experiencia y tamaño de empresa desde LinkedIn & Web Search.', provider: 'OpenRouter' },
    { name: 'perplexity_deep_search', category: 'Research', description: 'Realiza investigación profunda de mercado y análisis competitivo con Perplexity API.', provider: 'Perplexity' },
    { name: 'waba_template_dispatcher', category: 'Messaging', description: 'Envía plantillas WhatsApp oficiales con placeholders dinámicos.', provider: 'WhatsApp WABA' },
    { name: 'erpnext_sales_order_creator', category: 'ERP', description: 'Crea automáticamente Sales Orders y facturas electrónicas en Frappe ERPNext.', provider: 'Frappe API' },
    { name: 'google_maps_geocoder', category: 'Geo', description: 'Obtiene coordenadas, rutas y lugares cercanos con Google Maps Platform API.', provider: 'Google Maps' },
    { name: 'crm_stage_auto_advancer', category: 'Pipeline', description: 'Actualiza la etapa del lead evaluando el sentimiento y compromiso del cliente.', provider: 'Gemini 2.5' },
    { name: 'rag_knowledge_query', category: 'Knowledge', description: 'Consulta la base de conocimiento vectorial RAG para responder preguntas técnicas.', provider: 'Chroma/Firestore' },
    { name: 'web_scraper_headless', category: 'Scraper', description: 'Escanea sitios web de clientes para identificar tecnologías y emails de decisores.', provider: 'Puppeteer' }
  ];

  const handleTriggerEnrichment = () => {
    if (!enrichmentTarget) return;
    setIsEnriching(true);

    setTimeout(() => {
      const newLog: EnrichmentLog = {
        id: `en-${Date.now()}`,
        targetEmail: enrichmentTarget,
        companyName: companyName || 'Empresa Identificada',
        linkedinUrl: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        status: 'completed',
        dataPointsFound: Math.floor(Math.random() * 10) + 8,
        provider: 'OpenRouter',
        timestamp: 'Ahora mismo',
        summary: `Enriquecimiento completado: Decisor verificado, tecnología detectada, scoring comercial 92/100.`
      };

      setEnrichmentLogs((prev) => [newLog, ...prev]);
      setIsEnriching(false);
    }, 1800);
  };

  const filteredTools = selectedToolCategory === 'all'
    ? toolsList
    : toolsList.filter((t) => t.category.toLowerCase() === selectedToolCategory.toLowerCase());

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-7 h-7 text-indigo-600" />
            <span>AI Agents TS & Enrichment Engine (20 Tools)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Orquestación multi-agente cliente, herramientas autónomas TS, enriquecimiento con OpenRouter, Perplexity y LinkedIn API.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            20/20 Tools Activas
          </span>
        </div>
      </div>

      {/* TOP AGENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((ag) => (
          <div key={ag.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center space-x-3">
              <img src={ag.avatar} alt={ag.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{ag.name}</h3>
                <p className="text-xs text-indigo-600 font-semibold">{ag.role}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">{ag.bio}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
              <span>Leads Asignados: <strong className="text-slate-900">{ag.assignedLeadsCount}</strong></span>
              <span className="text-emerald-600 font-bold">Autónomo Activo</span>
            </div>
          </div>
        ))}
      </div>

      {/* ENRICHMENT LAUNCHPAD & RECENT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrichment Launcher Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>Ejecutar LinkedIn & Web Enrichment</span>
            </h2>
            <p className="text-xs text-slate-500">Ingresá datos para enriquecer prospectos mediante IA.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email del Contacto</label>
              <input
                type="email"
                value={enrichmentTarget}
                onChange={(e) => setEnrichmentTarget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-mono"
                placeholder="ejemplo@empresa.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nombre de la Empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                placeholder="TechCorp S.A."
              />
            </div>

            <button
              onClick={handleTriggerEnrichment}
              disabled={isEnriching}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2"
            >
              {isEnriching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enriqueciendo datos con OpenRouter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Iniciar Enriquecimiento Inteligente</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enrichment Logs Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span>Historial de Enriquecimiento (Enrichment Logs)</span>
              </h2>
              <p className="text-xs text-slate-500">Registros procesados por Perplexity, OpenRouter y LinkedIn enrichment.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{enrichmentLogs.length} procesados</span>
          </div>

          <div className="space-y-3">
            {enrichmentLogs.map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.companyName}</span>
                    <span className="text-slate-400 font-mono">({log.targetEmail})</span>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px]">
                    {log.provider}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">{log.summary}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Puntos de datos: {log.dataPointsFound} atributos</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 20 TS TOOLS CATALOGUE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <span>Catálogo de Herramientas TS (20 Agent Tools)</span>
            </h2>
            <p className="text-xs text-slate-500">Funciones ejecutables por agentes IA en backend Node.js.</p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            {['all', 'Enrichment', 'Research', 'Messaging', 'ERP', 'Geo'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedToolCategory(cat)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  selectedToolCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredTools.map((tool) => (
            <div key={tool.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-indigo-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-700 truncate">{tool.name}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">
                  {tool.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{tool.description}</p>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
                <span>API: {tool.provider}</span>
                <span className="text-emerald-600 font-bold">Activo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

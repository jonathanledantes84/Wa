import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  MessageSquare,
  Award,
  TrendingUp,
  FileText,
  Send,
  Play,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { BoardroomAdvisor, BoardroomSession, DiscussionMessage } from '../types';

export const AiBoardroomView: React.FC = () => {
  const [advisors] = useState<BoardroomAdvisor[]>([
    {
      id: 'adv-ceo',
      name: 'Elena Rostova',
      role: 'CEO',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      personality: 'Estratégica, enfocada en crecimiento acelerado y visión global.',
      focusArea: 'Crecimiento de Mercado & Valor de Compañía',
      aiModel: 'Gemini 2.5 Ultra',
      status: 'active'
    },
    {
      id: 'adv-cmo',
      name: 'Marcos Benítez',
      role: 'CMO',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
      personality: 'Creativo, centrado en CAC, campañas Meta Ads y conversión WABA.',
      focusArea: 'Adquisición de Clientes & Marca',
      aiModel: 'Gemini 2.5 Flash',
      status: 'active'
    },
    {
      id: 'adv-cto',
      name: 'Siddharth Patel',
      role: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      personality: 'Riguroso en arquitectura cloud, latencia de API, RAG e integración ERPNext.',
      focusArea: 'Infraestructura, Escalabilidad & IA TS',
      aiModel: 'Gemini 2.5 Pro',
      status: 'active'
    },
    {
      id: 'adv-cfo',
      name: 'Camila Morales',
      role: 'CFO',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      personality: 'Prudente, orientada a margen EBITDA, ROI de pauta y flujo de caja.',
      focusArea: 'Finanzas, Unit Economics & LTV/CAC',
      aiModel: 'Gemini 2.5 Flash',
      status: 'active'
    }
  ]);

  const [topicInput, setTopicInput] = useState<string>('¿Cómo escalar las ventas de WhatsApp B2B en un 40% durante Q4 manteniendo un EBITDA superior al 28%?');
  const [isDebating, setIsDebating] = useState<boolean>(false);

  const [activeSession, setActiveSession] = useState<BoardroomSession>({
    id: 'board-001',
    title: 'Estrategia de Expansión WABA Q4',
    topic: '¿Cómo escalar las ventas de WhatsApp B2B en un 40% durante Q4 manteniendo un EBITDA superior al 28%?',
    status: 'in_progress',
    createdAt: 'Hoy, 10:30 AM',
    messages: [
      {
        id: 'msg-1',
        senderName: 'Elena Rostova',
        senderRole: 'CEO',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        content: 'Colegas, la demanda de integración WhatsApp + ERP en la región creció un 65%. Propongo lanzar una oferta empaquetada para clientes Enterprise.',
        timestamp: '10:31 AM',
        type: 'advisor'
      },
      {
        id: 'msg-2',
        senderName: 'Marcos Benítez',
        senderRole: 'CMO',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
        content: 'Apoyo la iniciativa. Si reasignamos el 30% del presupuesto de Google Ads a campañas directas de Click-to-WhatsApp en Meta, estimo reducir el CAC un 22%.',
        timestamp: '10:32 AM',
        type: 'advisor',
        recommendations: ['Lanzar campañas Meta Ads directas a WABA', 'Implementar chatbot con calificación inmediata']
      },
      {
        id: 'msg-3',
        senderName: 'Camila Morales',
        senderRole: 'CFO',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
        content: 'El margen actual soporta la reinversión, pero debemos exigir contratos anuales pagados por adelantado para asegurar el flujo de caja positivo.',
        timestamp: '10:34 AM',
        type: 'advisor',
        recommendations: ['Descuento del 15% por pago anual anticipado', 'Mantener LTV/CAC > 4.5']
      }
    ],
    keyDecisions: [
      'Reasignación del 30% del presupuesto de marketing a campañas Click-to-WhatsApp.',
      'Condición de contrato anual prepago para paquete Enterprise con ERPNext.',
      'Meta de crecimiento de ARR a $350k para el cierre del año.'
    ]
  });

  const handleStartBoardDebate = () => {
    if (!topicInput.trim()) return;
    setIsDebating(true);

    setTimeout(() => {
      const newMessages: DiscussionMessage[] = [
        {
          id: `msg-${Date.now()}-1`,
          senderName: 'Elena Rostova',
          senderRole: 'CEO',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          content: `Revisando la pregunta: "${topicInput}". La clave está en automatizar el 70% del primer contacto con los agentes IA y derivar solo ventas calificadas a los ejecutivos.`,
          timestamp: 'Ahora',
          type: 'advisor'
        },
        {
          id: `msg-${Date.now()}-2`,
          senderName: 'Siddharth Patel',
          senderRole: 'CTO',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          content: 'Desde el punto de vista técnico, la arquitectura de Baileys + Gemini 2.5 puede procesar hasta 10,000 conversaciones simultáneas sin incremento en latencia.',
          timestamp: 'Ahora',
          type: 'advisor',
          recommendations: ['Habilitar RAG vectorial para soporte técnico autónomo', 'Sincronizar directamente con el pipeline de CRM']
        }
      ];

      setActiveSession((prev) => ({
        ...prev,
        topic: topicInput,
        messages: [...prev.messages, ...newMessages],
        keyDecisions: [
          ...prev.keyDecisions,
          `Aprobación técnica de escalado de infraestructura para "${topicInput}".`
        ]
      }));

      setIsDebating(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" />
            <span>AI Executive Boardroom (Directorio Estratégico IA)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sesiones de estrategia corporativa con directores virtuales (CEO, CMO, CTO, CFO) impulsados por modelos Gemini.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            4 Directores IA en Línea
          </span>
        </div>
      </div>

      {/* C-SUITE ADVISORS DISPLAY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {advisors.map((adv) => (
          <div key={adv.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="flex items-center space-x-3">
              <img src={adv.avatar} alt={adv.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-100 shadow-xs" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{adv.name}</h3>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded">
                  {adv.role}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">{adv.focusArea}</p>
              <p className="text-[11px] text-slate-500 italic">{adv.personality}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Modelo: {adv.aiModel}</span>
              <span className="text-emerald-600 font-bold">Activo</span>
            </div>
          </div>
        ))}
      </div>

      {/* BOARD SESSION DEBATE CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Transcript Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between h-[520px]">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span>Transcripción del Debate Ejecutivo</span>
              </h2>
              <p className="text-xs text-slate-500">{activeSession.title}</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{activeSession.createdAt}</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {activeSession.messages.map((msg) => (
              <div key={msg.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={msg.avatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded">
                      {msg.senderRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed">{msg.content}</p>

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-2 p-2 bg-purple-50/80 border border-purple-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold uppercase text-purple-800 block">Recomendaciones Clave:</span>
                    <ul className="list-disc list-inside text-xs text-purple-900 space-y-0.5">
                      {msg.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Prompt / Debate Topic Input */}
          <div className="pt-3 border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Planteá una consulta o tema de debate estratégico para la junta..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-500"
            />
            <button
              onClick={handleStartBoardDebate}
              disabled={isDebating}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1.5 shrink-0"
            >
              {isDebating ? (
                <span>Debatiendo...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Debatir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Executive Action Summary */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2 text-slate-100">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Acuerdos de Directorio</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Decisiones estratégicas alcanzadas en la sesión actual.</p>
          </div>

          <div className="space-y-3">
            {activeSession.keyDecisions.map((dec, index) => (
              <div key={index} className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-200 leading-relaxed">{dec}</p>
              </div>
            ))}
          </div>

          <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Exportar Acta de Directorio (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

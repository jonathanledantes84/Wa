import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  UserCheck,
  FileText,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  MessageSquare,
  Search,
  Filter,
  Tag,
  Hash,
  Edit2,
  Trash2,
  Copy,
  Info,
  GitBranch,
  Layers,
  Clock,
  Activity,
  Mail,
  ListTodo,
  UserPlus,
  Webhook,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import {
  AutomationRule,
  WhatsAppTemplate,
  Agent,
  WorkflowRule,
  WorkflowExecutionLog,
  WorkflowTriggerType,
  WorkflowActionType,
  WorkflowActionStep
} from '../types';
import { initialWorkflowRules, initialWorkflowLogs } from '../mockData';

interface AutomationViewProps {
  rules: AutomationRule[];
  templates: WhatsAppTemplate[];
  agents: Agent[];
  workflows?: WorkflowRule[];
  workflowLogs?: WorkflowExecutionLog[];
  onCreateRule: (rule: AutomationRule) => void;
  onToggleRule: (ruleId: string) => void;
  onCreateWorkflow?: (wf: WorkflowRule) => void;
  onToggleWorkflow?: (wfId: string) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  rules,
  templates,
  agents,
  workflows = initialWorkflowRules,
  workflowLogs = initialWorkflowLogs,
  onCreateRule,
  onToggleRule,
  onCreateWorkflow,
  onToggleWorkflow
}) => {
  const [mainTab, setMainTab] = useState<'workflows' | 'whatsapp_bot' | 'logs'>('workflows');
  
  // Local state for workflows if not provided by parent
  const [localWorkflows, setLocalWorkflows] = useState<WorkflowRule[]>(workflows);
  const [localLogs, setLocalLogs] = useState<WorkflowExecutionLog[]>(workflowLogs);

  // WhatsApp Keyword Rule Modal
  const [showModal, setShowModal] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<{
    matchedRule: AutomationRule | null;
    replyMessage: string | null;
  } | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'direct_text' | 'template' | 'agent' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Keyword Rule Form
  const [name, setName] = useState('');
  const [triggerKeyword, setTriggerKeyword] = useState('');
  const [matchType, setMatchType] = useState<'contains' | 'exact' | 'any'>('contains');
  const [actionType, setActionType] = useState<'direct_text' | 'send_template' | 'assign_agent' | 'update_stage' | 'ai_reply'>('direct_text');
  const [actionValue, setActionValue] = useState('');
  const [replyText, setReplyText] = useState('');

  // New Workflow Modal Form State
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [wfName, setWfName] = useState('');
  const [wfDescription, setWfDescription] = useState('');
  const [wfTriggerType, setWfTriggerType] = useState<WorkflowTriggerType>('new_lead_created');
  const [wfActions, setWfActions] = useState<WorkflowActionStep[]>([
    {
      id: 'step_1',
      type: 'assign_lead_to_user',
      config: { assignedAgentId: agents[0]?.id || 'agent_1' }
    },
    {
      id: 'step_2',
      type: 'send_email_notification',
      config: {
        recipientEmail: 'vendedor@empresa.com',
        emailSubject: '🔔 Alerta de Automatización: {{leadName}}',
        emailBody: 'Se ha procesado una regla automática para el lead {{leadName}}.'
      }
    }
  ]);
  const [simulatedTestSuccess, setSimulatedTestSuccess] = useState<string | null>(null);

  const handleToggleWf = (id: string) => {
    if (onToggleWorkflow) {
      onToggleWorkflow(id);
    }
    setLocalWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isEnabled: !w.isEnabled } : w))
    );
  };

  const handleRunWorkflowTest = (wf: WorkflowRule) => {
    const newLog: WorkflowExecutionLog = {
      id: `log_${Date.now()}`,
      workflowId: wf.id,
      workflowName: wf.name,
      triggerType: wf.triggerType,
      targetRecordName: 'Cliente Prueba (Simulación en Vivo)',
      targetRecordId: 'lead_test',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'Success',
      actionsExecutedCount: wf.actions.length,
      details: `Prueba ejecutada manualmente. Acciones procesadas con éxito: ${wf.actions.map(a => a.type).join(', ')}`
    };

    setLocalLogs([newLog, ...localLogs]);
    setSimulatedTestSuccess(`¡Prueba exitosa! El flujo "${wf.name}" ejecutó sus ${wf.actions.length} acciones correctamente.`);
    setTimeout(() => setSimulatedTestSuccess(null), 3000);
  };

  const handleAddActionStep = () => {
    const newStep: WorkflowActionStep = {
      id: `step_${Date.now()}`,
      type: 'create_followup_task',
      config: {
        taskTitle: 'Seguimiento automático de flujo comercial',
        taskDueDateDays: 1
      }
    };
    setWfActions([...wfActions, newStep]);
  };

  const handleRemoveActionStep = (id: string) => {
    setWfActions(wfActions.filter((a) => a.id !== id));
  };

  const handleCreateWorkflowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName) return;

    const newWf: WorkflowRule = {
      id: `wf_${Date.now()}`,
      name: wfName,
      description: wfDescription || 'Flujo de trabajo personalizado.',
      isEnabled: true,
      triggerType: wfTriggerType,
      conditions: [],
      actions: wfActions,
      executionCount: 0,
      createdBy: 'Carlos Benítez',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    if (onCreateWorkflow) {
      onCreateWorkflow(newWf);
    }
    setLocalWorkflows([newWf, ...localWorkflows]);
    setShowWorkflowModal(false);
    setWfName('');
    setWfDescription('');
  };

  const getTriggerLabel = (type: WorkflowTriggerType) => {
    switch (type) {
      case 'new_lead_created': return '✨ Nuevo Lead Creado';
      case 'deal_stage_changed': return '🔄 Etapa de Negocio Cambiada';
      case 'contact_updated': return '👤 Contacto Actualizado';
      case 'email_received': return '📬 Correo Recibido';
      case 'inactivity_period': return '⏰ Inactividad Prolongada';
      case 'whatsapp_received': return '💬 Mensaje de WhatsApp Recibido';
      default: return type;
    }
  };

  const getActionIcon = (type: WorkflowActionType) => {
    switch (type) {
      case 'send_email_notification': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'send_whatsapp_message': return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'create_followup_task': return <ListTodo className="w-4 h-4 text-amber-600" />;
      case 'assign_lead_to_user': return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'update_field': return <SlidersHorizontal className="w-4 h-4 text-slate-600" />;
      case 'add_tag': return <Tag className="w-4 h-4 text-indigo-600" />;
      case 'trigger_webhook': return <Webhook className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-7 h-7 text-amber-500 fill-amber-500" />
            Motor de Automatización & Flujos de Trabajo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Diseñe flujos de trabajo basados en disparadores y acciones automáticas (Emails, Tareas, Asignaciones, WhatsApp).
          </p>
        </div>

        {/* Top Tab Controls */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setMainTab('workflows')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-2 ${
              mainTab === 'workflows'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4 text-blue-600" />
            <span>Flujos de Trabajo ({localWorkflows.length})</span>
          </button>

          <button
            onClick={() => setMainTab('whatsapp_bot')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-2 ${
              mainTab === 'whatsapp_bot'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>Reglas WhatsApp & Bot</span>
          </button>

          <button
            onClick={() => setMainTab('logs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-2 ${
              mainTab === 'logs'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-600" />
            <span>Registro de Ejecuciones ({localLogs.length})</span>
          </button>
        </div>
      </div>

      {simulatedTestSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{simulatedTestSuccess}</span>
        </div>
      )}

      {/* TAB 1: WORKFLOW AUTOMATION ENGINE */}
      {mainTab === 'workflows' && (
        <div className="space-y-6">
          {/* Top Action & KPI Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                ⚡ Flujos Activos: <strong className="text-emerald-600">{localWorkflows.filter((w) => w.isEnabled).length}</strong> / {localWorkflows.length}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                📊 Ejecuciones Totales: <strong className="text-blue-600">{localWorkflows.reduce((a, b) => a + b.executionCount, 0)}</strong>
              </span>
            </div>

            <button
              onClick={() => setShowWorkflowModal(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Flujo de Trabajo</span>
            </button>
          </div>

          {/* Workflow Cards */}
          <div className="space-y-4">
            {localWorkflows.map((wf) => (
              <div
                key={wf.id}
                className={`bg-white border rounded-xl p-5 shadow-sm transition hover:shadow-md ${
                  wf.isEnabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900">{wf.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        wf.isEnabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {wf.isEnabled ? 'ACTIVO' : 'PAUSADO'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{wf.description}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => handleRunWorkflowTest(wf)}
                      className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition"
                      title="Probar ejecución en vivo"
                    >
                      <Play className="w-3.5 h-3.5 fill-purple-700" />
                      <span>Probar Flujo</span>
                    </button>

                    <button
                      onClick={() => handleToggleWf(wf.id)}
                      className="text-slate-400 hover:text-slate-600 transition"
                      title={wf.isEnabled ? 'Desactivar flujo' : 'Activar flujo'}
                    >
                      {wf.isEnabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Visual Node Flow Steps Diagram */}
                <div className="mt-4 pt-2">
                  <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mb-2">
                    Secuencia Visual de Automatización:
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Trigger Node */}
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs">
                      <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <span>{getTriggerLabel(wf.triggerType)}</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

                    {/* Action Nodes */}
                    {wf.actions.map((act, idx) => (
                      <React.Fragment key={act.id}>
                        <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 flex items-center space-x-2 shadow-xs">
                          {getActionIcon(act.type)}
                          <span className="capitalize">{act.type.replace(/_/g, ' ')}</span>
                        </div>
                        {idx < wf.actions.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Creado por: {wf.createdBy} ({wf.createdAt})</span>
                  <span>Ejecutado: {wf.executionCount} veces • Último: {wf.lastExecutedAt || 'Nunca'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WHATSAPP BOT & KEYWORD RULES */}
      {mainTab === 'whatsapp_bot' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 font-bold">
              Autorespuestas y reglas directas de WhatsApp por palabras clave.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Regla de Palabra Clave</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{rule.name}</span>
                  <button onClick={() => onToggleRule(rule.id)}>
                    {rule.isEnabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  <p className="text-[11px] text-slate-500 font-mono">Palabra clave: <strong className="text-slate-800">"{rule.triggerKeyword}"</strong></p>
                  <p className="text-xs text-slate-700 italic">"{rule.replyText || rule.actionValueName}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTION LOGS */}
      {mainTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider">Historial de Ejecuciones en Tiempo Real</h3>
              <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">
                Registros: {localLogs.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {localLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">{log.workflowName}</p>
                    <p className="text-slate-500">Objetivo: <strong className="text-slate-700">{log.targetRecordName}</strong></p>
                    <p className="text-[11px] text-slate-400">{log.details}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block">{log.timestamp}</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                      {log.status} ({log.actionsExecutedCount} Acciones)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WORKFLOW BUILDER MODAL */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Diseñar Nuevo Flujo de Trabajo (Workflow)</h3>
              </div>
              <button onClick={() => setShowWorkflowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflowSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Flujo de Trabajo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Asignación y Notificación Email a Leads Nuevos"
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  placeholder="Explique el propósito de esta automatización..."
                  value={wfDescription}
                  onChange={(e) => setWfDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Trigger Selector */}
              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>1. Seleccionar Evento Disparador (Trigger)</span>
                </label>
                <select
                  value={wfTriggerType}
                  onChange={(e) => setWfTriggerType(e.target.value as WorkflowTriggerType)}
                  className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="new_lead_created">✨ Nuevo Lead Creado (Web, Meta Ads, WhatsApp)</option>
                  <option value="deal_stage_changed">🔄 Etapa de Negocio Cambiada (Pipeline)</option>
                  <option value="contact_updated">👤 Contacto o Datos Actualizados</option>
                  <option value="email_received">📬 Correo Electrónico Recibido (Gmail / Outlook)</option>
                  <option value="inactivity_period">⏰ Inactividad Prolongada del Cliente</option>
                </select>
              </div>

              {/* Action Sequence */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    2. Secuencia de Acciones Automáticas ({wfActions.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddActionStep}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Acción</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {wfActions.map((step, idx) => (
                    <div key={step.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between space-x-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <select
                          value={step.type}
                          onChange={(e) => {
                            const newType = e.target.value as WorkflowActionType;
                            setWfActions(wfActions.map(s => s.id === step.id ? { ...s, type: newType } : s));
                          }}
                          className="bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
                        >
                          <option value="send_email_notification">📧 Enviar Notificación por Email</option>
                          <option value="send_whatsapp_message">💬 Enviar Mensaje por WhatsApp</option>
                          <option value="create_followup_task">📋 Crear Tarea de Seguimiento</option>
                          <option value="assign_lead_to_user">👤 Asignar Lead a Vendedor</option>
                          <option value="add_tag">🏷️ Añadir Etiqueta Comercial</option>
                          <option value="trigger_webhook">🌐 Disparar Webhook Externo</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveActionStep(step.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowWorkflowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-md transition"
                >
                  Guardar Flujo de Trabajo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

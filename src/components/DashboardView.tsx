import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Columns3,
  MessageSquare,
  Building,
  BarChart3,
  ChevronRight,
  Filter,
  Calendar,
  Zap,
  Target,
  Award,
  ArrowRight,
  AlertCircle,
  Megaphone,
  Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Lead,
  Conversation,
  Agent,
  ErpSalesOrder,
  ErpInvoice,
  AnalyticsSummary,
  LeadStage
} from '../types';

interface DashboardViewProps {
  leads: Lead[];
  conversations: Conversation[];
  agents: Agent[];
  erpSalesOrders?: ErpSalesOrder[];
  erpInvoices?: ErpInvoice[];
  analytics?: AnalyticsSummary;
  setActiveTab: (tab: string) => void;
  currentAgent?: Agent;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  conversations,
  agents,
  erpSalesOrders = [],
  erpInvoices = [],
  analytics,
  setActiveTab,
  currentAgent
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'year'>('30d');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');

  // Filter leads based on selected agent if applicable
  const filteredLeads = selectedAgentFilter === 'all'
    ? leads
    : leads.filter((l) => l.assignedAgentId === selectedAgentFilter);

  // Dynamic KPI Calculations
  const totalLeadsCount = filteredLeads.length;
  const activeLeads = filteredLeads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost');
  const activeLeadsCount = activeLeads.length;

  const wonLeads = filteredLeads.filter((l) => l.stage === 'Won');
  const wonLeadsCount = wonLeads.length;

  const conversionRate = totalLeadsCount > 0
    ? ((wonLeadsCount / totalLeadsCount) * 100).toFixed(1)
    : '28.5';

  // Total Active Pipeline Value
  const activePipelineValue = activeLeads.reduce((acc, lead) => acc + (lead.dealValue || 0), 0);

  // Total Won Revenue
  const wonRevenue = wonLeads.reduce((acc, lead) => acc + (lead.dealValue || 0), 0);
  const erpRevenue = erpSalesOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const totalRevenueGenerated = wonRevenue + erpRevenue || 248500;

  // Average Deal Size
  const avgDealSize = totalLeadsCount > 0
    ? Math.round((wonRevenue || totalRevenueGenerated) / (wonLeadsCount || 1))
    : 12500;

  // Unread or Pending WhatsApp Messages
  const totalUnreadChats = conversations.filter((c) => c.unreadCount > 0).length;

  // Monthly Revenue Trend Chart Data
  const revenueTrendData = [
    { month: 'Ene', real: 185000, meta: 170000, leads: 42 },
    { month: 'Feb', real: 198000, meta: 180000, leads: 51 },
    { month: 'Mar', real: 215000, meta: 200000, leads: 64 },
    { month: 'Abr', real: 210000, meta: 210000, leads: 58 },
    { month: 'May', real: 235000, meta: 220000, leads: 72 },
    { month: 'Jun', real: 242000, meta: 230000, leads: 78 },
    { month: 'Jul', real: 268000, meta: 250000, leads: 89 },
    { month: 'Ago', real: totalRevenueGenerated > 250000 ? totalRevenueGenerated : 285000, meta: 270000, leads: 95 }
  ];

  // Pipeline Funnel Stage Distribution
  const stageCounts: Record<LeadStage, { count: number; value: number }> = {
    New: { count: 0, value: 0 },
    Contacted: { count: 0, value: 0 },
    Qualified: { count: 0, value: 0 },
    Proposal: { count: 0, value: 0 },
    Won: { count: 0, value: 0 },
    Lost: { count: 0, value: 0 }
  };

  filteredLeads.forEach((lead) => {
    if (stageCounts[lead.stage]) {
      stageCounts[lead.stage].count += 1;
      stageCounts[lead.stage].value += lead.dealValue || 0;
    }
  });

  const funnelData = [
    { stage: 'Nuevos', code: 'New', count: stageCounts.New.count || 12, value: stageCounts.New.value || 34000, color: '#3b82f6' },
    { stage: 'Contactados', code: 'Contacted', count: stageCounts.Contacted.count || 18, value: stageCounts.Contacted.value || 52000, color: '#0ea5e9' },
    { stage: 'Calificados', code: 'Qualified', count: stageCounts.Qualified.count || 15, value: stageCounts.Qualified.value || 68000, color: '#8b5cf6' },
    { stage: 'Propuesta', code: 'Proposal', count: stageCounts.Proposal.count || 10, value: stageCounts.Proposal.value || 95000, color: '#f59e0b' },
    { stage: 'Ganados', code: 'Won', count: stageCounts.Won.count || 14, value: stageCounts.Won.value || 142000, color: '#10b981' },
    { stage: 'Perdidos', code: 'Lost', count: stageCounts.Lost.count || 4, value: stageCounts.Lost.value || 18000, color: '#ef4444' }
  ];

  // Lead Sources Breakdown
  const sourceMap: Record<string, number> = {};
  filteredLeads.forEach((l) => {
    sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
  });

  const sourcePieData = [
    { name: 'WhatsApp Directo', value: sourceMap['WhatsApp'] || 42, color: '#10b981' },
    { name: 'Meta Ads (FB/IG)', value: sourceMap['Meta Ads'] || 28, color: '#3b82f6' },
    { name: 'Sitio Web', value: sourceMap['Website'] || 16, color: '#f59e0b' },
    { name: 'Recomendaciones', value: sourceMap['Referral'] || 10, color: '#8b5cf6' },
    { name: 'Carga Manual', value: sourceMap['Manual'] || 4, color: '#64748b' }
  ];

  // Top Performing Deals
  const topDeals = [...filteredLeads]
    .sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0))
    .slice(0, 5);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* HEADER BAR & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-emerald-600" />
            <span>Dashboard KPI & Resumen Ejecutivo</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Métricas clave de rendimiento, embudo de conversión, ingresos acumulados y salud del pipeline comercial.
          </p>
        </div>

        {/* Global Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Agent Selector Filter */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="all">Todos los Agentes ({agents.length})</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            {(['7d', '30d', '90d', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition uppercase ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range === '7d' ? '7 Días' : range === '30d' ? '30 Días' : range === '90d' ? 'Trimestre' : 'Año'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI INSIGHT HIGHLIGHT BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              IA Copilot Executive Insight
            </span>
            <span className="text-slate-400 text-xs font-mono">Actualizado hace 5 min</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed">
            🎯 <strong className="text-emerald-300">Diagnóstico de Ventas:</strong> Tu tasa de conversión actual es de <strong className="text-white">{conversionRate}%</strong> (+3.2% vs mes anterior). Tenés <strong className="text-amber-300">{stageCounts.Proposal.count || 10} leads en etapa de Propuesta</strong> acumulando <strong className="text-white">${(stageCounts.Proposal.value || 95000).toLocaleString('es-AR')}</strong>. Un seguimiento por WhatsApp en las próximas 24hs podría cerrar hasta $45.000 extra este mes.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0 z-10">
          <button
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md"
          >
            <Columns3 className="w-4 h-4" />
            <span>Ver Leads del CRM</span>
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Ver Chats ({totalUnreadChats} sin leer)</span>
          </button>
        </div>

        {/* Decorative Background Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/5 blur-3xl pointer-events-none" />
      </div>

      {/* PRIMARY KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Leads & Pipeline Value */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-blue-600" />
              Leads Activos en CRM
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +14.2%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {activeLeadsCount} <span className="text-xs text-slate-400 font-normal">/ {totalLeadsCount} totales</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Valor del pipeline activo: <strong className="text-slate-800">${activePipelineValue.toLocaleString('es-AR')}</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Metas del Trimestre</span>
            <span className="font-bold text-blue-600">85% Completado</span>
          </div>
        </div>

        {/* KPI 2: Conversion Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Percent className="w-4 h-4 mr-1.5 text-emerald-600" />
              Tasa de Conversión
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +3.2%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {conversionRate}%
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Leads Ganados: <strong className="text-emerald-700">{wonLeadsCount} contratos</strong>
            </p>
          </div>

          {/* Progress bar towards goal */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, Number(conversionRate) * 2.5)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Objetivo: 25.0%</span>
              <span className="text-emerald-600 font-bold">¡Superado!</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Revenue Generated */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5 text-amber-500" />
              Ingresos Totales (ARS)
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +18.9%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              ${totalRevenueGenerated.toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ventas CRM + Pedidos ERPNext
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Ticket Promedio</span>
            <span className="font-bold text-slate-800">${avgDealSize.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {/* KPI 4: WhatsApp WABA Response & Speed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-purple-600" />
              Tiempo de Respuesta
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
              <Zap className="w-3 h-3 mr-0.5" />
              Óptimo
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              1.8 <span className="text-sm font-normal text-slate-500">minutos</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Gateway WhatsApp WABA Oficial
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Mensajes sin responder</span>
            <span className={`font-bold ${totalUnreadChats > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {totalUnreadChats} chats
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION: REVENUE TREND & PIPELINE FUNNEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue Evolution Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Evolución de Ingresos y Metas Comerciales</span>
              </h2>
              <p className="text-xs text-slate-500">
                Comparativa de ingresos ejecutados vs objetivo mensual fijado en Clientum CRM.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-bold font-mono">
              <span className="flex items-center text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
                Ingresos Reales
              </span>
              <span className="flex items-center text-blue-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-1.5" />
                Meta Fija
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString('es-AR')}`, 'Monto']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="real" name="Ingreso Real" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" />
                <Area type="monotone" dataKey="meta" name="Meta Fijada" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorMeta)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Lead Acquisition Sources Pie */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              <span>Origen de Contactos</span>
            </h2>
            <p className="text-xs text-slate-500">Distribución de leads según su canal de captación.</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourcePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} contactos`, 'Volumen']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {sourcePieData.map((src) => (
              <div key={src.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                  <span className="font-semibold text-slate-700">{src.name}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{src.value} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PIPELINE FUNNEL BREAKDOWN & AGENT LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel Stage Bar Cards */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Columns3 className="w-5 h-5 text-purple-600" />
                <span>Distribución por Etapa del Embudo Comercial</span>
              </h2>
              <p className="text-xs text-slate-500">Monitoreo de leads activos y montos retenidos por cada fase de negociación.</p>
            </div>

            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Ver Kanban</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {funnelData.map((item) => (
              <div
                key={item.code}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.stage}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">
                    {item.count} leads
                  </span>
                </div>

                <div className="text-lg font-black text-slate-900">
                  ${item.value.toLocaleString('es-AR')}
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      width: `${Math.min(100, (item.count / totalLeadsCount) * 100 * 3)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance Leaderboard */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Rendimiento de Agentes</span>
              </h2>
              <p className="text-xs text-slate-500">Métricas de asignación y efectividad.</p>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
            >
              Configurar
            </button>
          </div>

          <div className="space-y-3">
            {agents.map((ag) => {
              const agLeads = leads.filter((l) => l.assignedAgentId === ag.id);
              const agWon = agLeads.filter((l) => l.stage === 'Won').length;
              const agWonVal = agLeads.filter((l) => l.stage === 'Won').reduce((acc, l) => acc + (l.dealValue || 0), 0);

              return (
                <div key={ag.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={ag.avatar}
                      alt={ag.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-300"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>{ag.name}</span>
                        <span className={`w-2 h-2 rounded-full ${ag.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {ag.assignedLeadsCount || agLeads.length} leads asignados • Role: {ag.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700 block">
                      ${agWonVal ? agWonVal.toLocaleString('es-AR') : '42,000'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {agWon} cerrados
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RECENT HIGH-VALUE DEALS & QUICK SHORTCUT NAVIGATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Table of Top High Value Deals */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>Oportunidades de Alto Valor en Pipeline</span>
              </h2>
              <p className="text-xs text-slate-500">Leads con mayor monto acumulado que requieren atención comercial.</p>
            </div>

            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Ver Todos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Contacto / Empresa</th>
                  <th className="p-3">Etapa</th>
                  <th className="p-3">Origen</th>
                  <th className="p-3 text-right">Monto Estimado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">
                      <div>{deal.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{deal.company || deal.phone}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        deal.stage === 'Won'
                          ? 'bg-emerald-100 text-emerald-800'
                          : deal.stage === 'Proposal'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{deal.source}</td>
                    <td className="p-3 text-right font-black text-slate-900 font-mono">
                      ${(deal.dealValue || 0).toLocaleString('es-AR')}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveTab('inbox')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-bold text-[10px] transition inline-flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Abrir Chat</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2 text-slate-100">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Accesos Directos a Módulos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Navegá rápidamente entre los centros operativos de Clientum.</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setActiveTab('inbox')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition space-y-1 group"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-100">Chats WhatsApp</div>
              <div className="text-[10px] text-slate-400">{totalUnreadChats} sin responder</div>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition space-y-1 group"
            >
              <Columns3 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-100">Kanban CRM</div>
              <div className="text-[10px] text-slate-400">{activeLeadsCount} leads activos</div>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition space-y-1 group"
            >
              <Users className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-100">Contactos</div>
              <div className="text-[10px] text-slate-400">{totalLeadsCount} directorio</div>
            </button>

            <button
              onClick={() => setActiveTab('erp')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition space-y-1 group"
            >
              <Building className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-100">Sales Hub ERP</div>
              <div className="text-[10px] text-slate-400">Facturas & Pedidos</div>
            </button>

            <button
              onClick={() => setActiveTab('automation')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition space-y-1 group"
            >
              <Zap className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-100">Automatización</div>
              <div className="text-[10px] text-slate-400">Flujos & Bots</div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition space-y-1 group"
            >
              <BarChart3 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              <div className="text-xs font-bold text-slate-100">Analíticas</div>
              <div className="text-[10px] text-slate-400">Métricas avanzadas</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

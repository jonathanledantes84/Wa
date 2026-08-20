import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Columns3,
  Building,
  UtensilsCrossed,
  Store,
  Server,
  Palette,
  Megaphone,
  FileText,
  Bot,
  BarChart3,
  Settings,
  Users,
  Brain,
  ChevronRight,
  Layers,
  Link,
  CreditCard,
  Wifi,
  Cpu,
  Building2,
  GitMerge,
  Terminal,
  Sparkles
} from 'lucide-react';
import { Agent } from '../types';
import { isTaskOverdue } from '../lib/tasks';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agents: Agent[];
  currentAgent: Agent;
  setCurrentAgent: (agent: Agent) => void;
  unreadCountTotal: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  agents,
  currentAgent,
  setCurrentAgent,
  unreadCountTotal
}) => {
  const overdueTasksCount = currentAgent.active_tasks?.filter(isTaskOverdue).length || 0;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard KPI',
      icon: LayoutDashboard,
    },
    {
      id: 'inbox',
      label: 'Chats de WhatsApp',
      icon: MessageSquare,
      badge: unreadCountTotal > 0 ? unreadCountTotal : undefined,
      alertBadge: overdueTasksCount > 0 ? overdueTasksCount : undefined,
    },
    {
      id: 'contacts',
      label: 'Directorio de Contactos',
      icon: Users,
    },
    {
      id: 'segments',
      label: 'Segmentación de Clientes',
      icon: Layers,
    },
    {
      id: 'ai_agents',
      label: 'AI Agents TS (20 Tools)',
      icon: Cpu,
    },
    {
      id: 'ai_boardroom',
      label: 'AI Boardroom C-Suite',
      icon: Brain,
    },
    {
      id: 'virtual_office',
      label: 'Virtual Office 2D',
      icon: Building2,
    },
    {
      id: 'chatbot',
      label: 'Chatbot IA & Handover',
      icon: Bot,
    },
    {
      id: 'pipeline',
      label: 'Leads del CRM',
      icon: Columns3,
    },
    {
      id: 'erp',
      label: 'Clientum Sales Hub',
      icon: Building,
    },
    {
      id: 'architecture',
      label: 'Architecture Blueprint',
      icon: Layers,
    },
    {
      id: 'n8n_flow',
      label: 'n8n Flow Editor',
      icon: GitMerge,
    },
    {
      id: 'clientum_os_hub',
      label: 'Clientum OS Hub',
      icon: Server,
    },
    {
      id: 'restaurant',
      label: 'Restaurante & POS',
      icon: UtensilsCrossed,
    },
    {
      id: 'ecommerce',
      label: 'Tienda E-Commerce',
      icon: Store,
    },
    {
      id: 'cluster',
      label: 'SaaS Cluster & Quotas',
      icon: Server,
    },
    {
      id: 'theme',
      label: 'SaaS Theme Engine',
      icon: Palette,
    },
    {
      id: 'broadcasts',
      label: 'Difusiones',
      icon: Megaphone,
    },
    {
      id: 'templates',
      label: 'Plantillas Meta',
      icon: FileText,
    },
    {
      id: 'automation',
      label: 'Automatizaciones',
      icon: Bot,
    },
    {
      id: 'knowledge',
      label: 'Base de Conocimiento (RAG)',
      icon: Brain,
    },
    {
      id: 'analytics',
      label: 'Métricas y Analíticas',
      icon: BarChart3,
    },
    {
      id: 'sites',
      label: 'Tenant Sites (ERPNext)',
      icon: Link,
    },
    {
      id: 'subscriptions',
      label: 'Suscripciones',
      icon: CreditCard,
    },
    {
      id: 'whatsapp',
      label: 'Baileys Gateway',
      icon: Wifi,
    },
    {
      id: 'settings',
      label: 'Configuración y Meta',
      icon: Settings,
    }
  ];

  return (
    <aside className="w-16 md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 select-none border-r border-slate-800">
      {/* Top Nav Items */}
      <nav className="py-4 space-y-1">
        <div className="px-6 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:block">
          Menú Principal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 md:px-6 py-2.5 text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-green-400 md:border-r-4 border-green-500 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? 'text-green-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate hidden md:block">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="bg-green-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full shrink-0 hidden md:block">
                  {item.badge}
                </span>
              )}

              {item.alertBadge !== undefined && (
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full shrink-0 hidden md:block">
                  ⚠️ {item.alertBadge}
                </span>
              )}

              {/* Mobile badge indicator */}
              {(item.badge !== undefined || item.alertBadge !== undefined) && (
                <span className={`md:hidden absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${item.alertBadge ? 'bg-amber-500' : 'bg-green-500'}`}></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Agent Profile Switcher */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="relative group">
          <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700/60">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={currentAgent.avatar}
                alt={currentAgent.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 hidden md:block">
                <p className="text-xs font-medium text-slate-200 truncate">{currentAgent.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentAgent.role}</p>
              </div>
            </div>

            {/* Select dropdown */}
            <div className="hidden md:block">
              <select
                value={currentAgent.id}
                onChange={(e) => {
                  const selected = agents.find((a) => a.id === e.target.value);
                  if (selected) setCurrentAgent(selected);
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="Switch Active Agent"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id} className="bg-slate-900 text-slate-200">
                    {agent.name} ({agent.role})
                  </option>
                ))}
              </select>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

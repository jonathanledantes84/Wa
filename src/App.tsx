import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { InboxView } from './components/InboxView';
import { ContactsView } from './components/ContactsView';
import { PipelineView } from './components/PipelineView';
import { BroadcastsView } from './components/BroadcastsView';
import { TemplateView } from './components/TemplateView';
import { AutomationView } from './components/AutomationView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ErpView } from './components/ErpView';
import { RestaurantView } from './components/RestaurantView';
import { EcommerceView } from './components/EcommerceView';
import { SaaSClusterView } from './components/SaaSClusterView';
import { SaaSThemeView } from './components/SaaSThemeView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { CustomerSegmentsView } from './components/CustomerSegmentsView';
import { ChatbotView } from './components/ChatbotView';
import { SitesView } from './components/SitesView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { WhatsAppBaileysSettings } from './components/WhatsAppBaileysSettings';
import { DelegateTaskModal } from './components/DelegateTaskModal';
import { ActivityStreamDrawer } from './components/ActivityStreamDrawer';
import { AiAgentsView } from './components/AiAgentsView';
import { AiBoardroomView } from './components/AiBoardroomView';
import { VirtualOfficeView } from './components/VirtualOfficeView';
import { ArchitectureBlueprintView } from './components/ArchitectureBlueprintView';
import { N8nFlowEditorView } from './components/N8nFlowEditorView';
import { ClientumOsHubView } from './components/ClientumOsHubView';
import { AiAssistantModal } from './components/AiAssistantModal';

import {
  initialTenant,
  initialAgents,
  initialLeads,
  initialConversations,
  initialMessages,
  initialTemplates,
  initialCampaigns,
  initialAutomationRules,
  initialAnalytics,
  initialErpItems,
  initialErpSalesOrders,
  initialErpInvoices,
  initialRestaurantTables,
  initialMenuItems,
  initialRestaurantOrders,
  initialEcommerceProducts,
  initialStoreOrders,
  initialSaaSClusterSites,
  initialGeoStatesAndCities,
  initialSaaSThemeConfig,
  initialCurrentSaaSUser,
  initialAuditLogs,
  initialKnowledgeDocs,
  initialActivityStream,
  initialCustomerSegments,
  initialChatbotConfig
} from './mockData';

import {
  Tenant,
  Agent,
  Lead,
  Conversation,
  WhatsAppMessage,
  WhatsAppTemplate,
  Campaign,
  AutomationRule,
  LeadStage,
  ErpItem,
  ErpSalesOrder,
  ErpInvoice,
  RestaurantTable,
  MenuItem,
  RestaurantOrder,
  RestaurantOrderStatus,
  EcommerceProduct,
  StoreOrder,
  SaaSClusterSite,
  GeoStateCity,
  ClusterSiteStatus,
  SaaSThemeConfig,
  SaaSUserSession,
  AuditLogItem,
  KnowledgeDocument,
  ActivityStreamItem,
  AgentTask,
  CustomerSegment,
  ChatbotConfig
} from './types';

import { Sparkles, X, Send, Activity, UserCheck } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenant, setTenant] = useState<Tenant>(initialTenant);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [currentAgent, setCurrentAgent] = useState<Agent>(initialAgents[0]);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('clientum_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });
  const [messages, setMessages] = useState<Record<string, WhatsAppMessage[]>>(() => {
    const saved = localStorage.getItem('clientum_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(initialTemplates);
  // Sync conversations and messages to localStorage
  React.useEffect(() => {
    localStorage.setItem('clientum_conversations', JSON.stringify(conversations));
    localStorage.setItem('clientum_messages', JSON.stringify(messages));
  }, [conversations, messages]);

  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [erpItems, setErpItems] = useState<ErpItem[]>(initialErpItems);
  const [erpSalesOrders, setErpSalesOrders] = useState<ErpSalesOrder[]>(initialErpSalesOrders);
  const [erpInvoices, setErpInvoices] = useState<ErpInvoice[]>(initialErpInvoices);

  const [restaurantTables, setRestaurantTables] = useState<RestaurantTable[]>(initialRestaurantTables);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [restaurantOrders, setRestaurantOrders] = useState<RestaurantOrder[]>(initialRestaurantOrders);

  const [ecommerceProducts, setEcommerceProducts] = useState<EcommerceProduct[]>(initialEcommerceProducts);
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>(initialStoreOrders);

  const [saasClusterSites, setSaasClusterSites] = useState<SaaSClusterSite[]>(initialSaaSClusterSites);
  const [geoStatesAndCities, setGeoStatesAndCities] = useState<GeoStateCity[]>(initialGeoStatesAndCities);
  const [saasThemeConfig, setSaasThemeConfig] = useState<SaaSThemeConfig>(initialSaaSThemeConfig);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(initialKnowledgeDocs);
  const [activityStream, setActivityStream] = useState<ActivityStreamItem[]>(initialActivityStream);

  const [segments, setSegments] = useState<CustomerSegment[]>(initialCustomerSegments);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>(initialChatbotConfig);

  const handleCreateSegment = (newSeg: CustomerSegment) => {
    setSegments((prev) => [newSeg, ...prev]);
  };

  const handleUpdateSegment = (updatedSeg: CustomerSegment) => {
    setSegments((prev) => prev.map((s) => (s.id === updatedSeg.id ? updatedSeg : s)));
  };

  const handleDeleteSegment = (segmentId: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== segmentId));
  };

  const handleUpdateChatbotConfig = (newConfig: ChatbotConfig) => {
    setChatbotConfig(newConfig);
  };

  const handleToggleConversationManagedBy = (convId: string, newMode: 'bot' | 'human') => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, managedBy: newMode } : c))
    );
  };

  const [showActivityDrawer, setShowActivityDrawer] = useState<boolean>(false);
  const [showDelegateModal, setShowDelegateModal] = useState<boolean>(false);
  const [itemToDelegate, setItemToDelegate] = useState<{
    leadId?: string;
    leadName?: string;
    phone?: string;
    convId?: string;
    type: 'WhatsApp Thread' | 'Follow-up Lead' | 'General Task';
  } | null>(null);

  const handleOpenDelegateModal = (item: {
    leadId?: string;
    leadName?: string;
    phone?: string;
    convId?: string;
    type: 'WhatsApp Thread' | 'Follow-up Lead';
  }) => {
    setItemToDelegate(item);
    setShowDelegateModal(true);
  };

  const handleConfirmDelegation = (data: {
    agentId: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    notes: string;
    leadId?: string;
    leadName?: string;
    convId?: string;
  }) => {
    const targetAgent = agents.find((a) => a.id === data.agentId);

    const newTask: AgentTask = {
      id: `task_${Date.now()}`,
      title: data.title,
      assignedBy: currentAgent.name,
      assignedAt: new Date().toISOString().slice(0, 10),
      priority: data.priority,
      status: 'Pending',
      dueDate: data.dueDate.slice(0, 10),
      notes: data.notes
    };

    setAgents((prev) =>
      prev.map((ag) =>
        ag.id === data.agentId
          ? {
              ...ag,
              assignedLeadsCount: ag.assignedLeadsCount + 1,
              active_tasks: [newTask, ...(ag.active_tasks || [])]
            }
          : ag
      )
    );

    const newActivity: ActivityStreamItem = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: currentAgent.name,
      agentAvatar: currentAgent.avatar,
      actionType: 'DELEGATION',
      description: `Delegó la tarea "${data.title}" a ${targetAgent?.name || 'Agente'}`,
      status: 'Pending',
      timeAgo: 'Ahora mismo',
      resourceId: newTask.id
    };

    setActivityStream((prev) => [newActivity, ...prev]);

    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userEmail: currentUser?.email || 'admin@clientum.com',
      userName: currentAgent.name,
      action: 'DELEGATE_TASK',
      category: 'AGENT',
      resource: `Agente: ${targetAgent?.name || data.agentId}`,
      ipAddress: '192.168.1.104',
      status: 'Success',
      details: `Tarea "${data.title}" delegada con éxito.`
    };

    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleAddKnowledgeDoc = (doc: KnowledgeDocument) => {
    setKnowledgeDocs((prev) => [doc, ...prev]);

    const newActivity: ActivityStreamItem = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: currentAgent.name,
      agentAvatar: currentAgent.avatar,
      actionType: 'KNOWLEDGE_INDEX',
      description: `Indexó un nuevo documento RAG: "${doc.title}"`,
      status: 'Completed',
      timeAgo: 'Ahora mismo',
      resourceId: doc.id
    };
    setActivityStream((prev) => [newActivity, ...prev]);

    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userEmail: currentUser?.email || 'admin@clientum.com',
      userName: currentAgent.name,
      action: 'INDEX_RAG_DOC',
      category: 'SYSTEM',
      resource: doc.title,
      ipAddress: '192.168.1.104',
      status: 'Success',
      details: `Indexados ${doc.embeddingVectorCount} vectores en la base de conocimientos RAG.`
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleDeleteKnowledgeDoc = (docId: string) => {
    setKnowledgeDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleTriggerMockActivity = () => {
    const mockActions: {
      type: ActivityStreamItem['actionType'];
      desc: string;
      resId: string;
    }[] = [
      {
        type: 'ERP_INVOICE',
        desc: 'Emitió la Factura de Crédito A-0004-9812 por $18,500 en ERPNext',
        resId: 'ACC-SINV-2026-0099'
      },
      {
        type: 'LEAD_STAGE',
        desc: 'Avanzó el lead "Constructora del Sur" a la etapa Propuesta Comercial',
        resId: 'lead_104'
      },
      {
        type: 'KNOWLEDGE_INDEX',
        desc: 'Recuperó contexto RAG para responder cotización de WhatsApp',
        resId: 'kb_001'
      }
    ];

    const random = mockActions[Math.floor(Math.random() * mockActions.length)];
    const newAct: ActivityStreamItem = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: currentAgent.name,
      agentAvatar: currentAgent.avatar,
      actionType: random.type,
      description: random.desc,
      status: 'Completed',
      timeAgo: 'Ahora mismo',
      resourceId: random.resId
    };

    setActivityStream((prev) => [newAct, ...prev]);
  };

  // Check agent tasks due within 24 hours and push Alert notification to ActivityStream
  const notifiedTasksRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    const checkUpcomingTasks = () => {
      const now = new Date().getTime();
      const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

      agents.forEach((agent) => {
        (agent.active_tasks || []).forEach((task) => {
          if (!task.dueDate || notifiedTasksRef.current.has(task.id) || task.status === 'Completed') return;

          let dueTimestamp: number | null = null;
          const parsed = Date.parse(task.dueDate);
          if (!isNaN(parsed)) {
            dueTimestamp = parsed;
          } else {
            dueTimestamp = now + 12 * 60 * 60 * 1000;
          }

          if (dueTimestamp) {
            const diff = dueTimestamp - now;
            if (diff > 0 && diff <= TWENTY_FOUR_HOURS_MS) {
              notifiedTasksRef.current.add(task.id);
              const hoursLeft = Math.max(1, Math.round(diff / (1000 * 60 * 60)));

              const alertAct: ActivityStreamItem = {
                id: `act_alert_${task.id}_${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                agentName: agent.name,
                agentAvatar: agent.avatar,
                actionType: 'DELEGATION',
                description: `⚠️ Tarea por vencer (${hoursLeft}h): "${task.title}" (Asignado: ${agent.name})`,
                status: 'Alert',
                timeAgo: 'Hace un momento',
                resourceId: task.id
              };

              setActivityStream((prev) => [alertAct, ...prev]);
            }
          }
        });
      });
    };

    checkUpcomingTasks();
    const interval = setInterval(checkUpcomingTasks, 30000);
    return () => clearInterval(interval);
  }, [agents]);

  const [currentUser, setCurrentUser] = useState<SaaSUserSession | null>(() => {
    const saved = localStorage.getItem('clientum_saas_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCurrentSaaSUser;
      }
    }
    return initialCurrentSaaSUser;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginSuccess = (user: SaaSUserSession) => {
    setCurrentUser(user);
    localStorage.setItem('clientum_saas_session', JSON.stringify(user));
    setTenant(prev => ({ ...prev, name: user.companyName }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('clientum_saas_session');
    setShowAuthModal(true);
  };

  const [selectedConvId, setSelectedConvId] = useState<string>(initialConversations[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiCopilotModal, setShowAiCopilotModal] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiCustomResult, setAiCustomResult] = useState<string | null>(null);
  const [loadingAiCustom, setLoadingAiCustom] = useState(false);

  // Unread messages sum
  const unreadCountTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Send WhatsApp message handler
  const handleSendMessage = (
    convId: string,
    text: string,
    isNote = false,
    templateName?: string,
    scheduledAt?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: WhatsAppMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      sender: isNote ? 'agent' : 'agent',
      senderName: currentAgent.name,
      text,
      type: templateName ? 'template' : 'text',
      timestamp: timeStr,
      status: 'delivered',
      templateName,
      isNote,
      scheduledAt
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));

    // Update conversation preview
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: isNote ? `[Note]: ${text}` : text,
            lastMessageTimestamp: timeStr,
            unreadCount: 0
          };
        }
        return c;
      })
    );

    // Update tenant credit usage if customer message
    if (!isNote) {
      setTenant((prev) => ({
        ...prev,
        creditsUsed: prev.creditsUsed + 1
      }));
    }

    // Simulate automated customer/lead reply after 2.5 seconds if customer message
    if (!isNote) {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReplyMsg: WhatsAppMessage = {
          id: `msg_reply_${Date.now()}`,
          conversationId: convId,
          sender: 'lead',
          text: `Thank you ${currentAgent.name}! I received your message regarding our Clientum CRM setup. Let's proceed. 👍`,
          type: 'text',
          timestamp: replyTime,
          status: 'read'
        };

        setMessages((prevMsgs) => ({
          ...prevMsgs,
          [convId]: [...(prevMsgs[convId] || []), autoReplyMsg]
        }));

        setConversations((prevConvs) =>
          prevConvs.map((c) => {
            if (c.id === convId) {
              return {
                ...c,
                lastMessage: autoReplyMsg.text,
                lastMessageTimestamp: replyTime
              };
            }
            return c;
          })
        );
      }, 2500);
    }
  };

  // Lead stage update handler
  const handleUpdateLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );

    setConversations((prev) =>
      prev.map((c) => (c.leadId === leadId ? { ...c, stage: newStage } : c))
    );
  };

  // Assign agent handler
  const handleAssignAgent = (leadId: string, agentId: string) => {
    const ag = agents.find((a) => a.id === agentId);

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, assignedAgentId: agentId, assignedAgentName: ag?.name }
          : l
      )
    );

    setConversations((prev) =>
      prev.map((c) =>
        c.leadId === leadId
          ? { ...c, assignedAgentId: agentId, assignedAgentName: ag?.name }
          : c
      )
    );
  };

  // Jump from Lead Pipeline directly into WhatsApp Chat
  const handleSelectLeadForChat = (leadId: string) => {
    const conv = conversations.find((c) => c.leadId === leadId);
    if (conv) {
      setSelectedConvId(conv.id);
      setActiveTab('inbox');
    }
  };

  // Create new Lead handler
  const handleCreateLead = (leadData: Partial<Lead>) => {
    const newLeadId = `lead_${Date.now()}`;
    const newConvId = `conv_${Date.now()}`;

    const newLead: Lead = {
      id: newLeadId,
      name: leadData.name || 'New Lead',
      phone: leadData.phone || '+1 (555) 000-0000',
      email: leadData.email || 'lead@example.com',
      company: leadData.company || 'Individual',
      dealValue: leadData.dealValue || 5000,
      stage: leadData.stage || 'New',
      source: leadData.source || 'WhatsApp',
      assignedAgentId: currentAgent.id,
      assignedAgentName: currentAgent.name,
      tags: leadData.tags || ['Inbound'],
      lastContacted: 'Just now',
      notes: leadData.notes || '',
      score: 80
    };

    const newConv: Conversation = {
      id: newConvId,
      leadId: newLeadId,
      leadName: newLead.name,
      phone: newLead.phone,
      lastMessage: 'Conversation initialized in Clientum CRM.',
      lastMessageTimestamp: 'Just now',
      unreadCount: 0,
      assignedAgentId: currentAgent.id,
      assignedAgentName: currentAgent.name,
      tags: newLead.tags,
      stage: newLead.stage
    };

    const initialSystemMsg: WhatsAppMessage = {
      id: `msg_sys_${Date.now()}`,
      conversationId: newConvId,
      sender: 'system',
      text: `WhatsApp chat session created for ${newLead.name} (${newLead.company}).`,
      type: 'text',
      timestamp: 'Just now',
      status: 'read'
    };

    setLeads((prev) => [newLead, ...prev]);
    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({ ...prev, [newConvId]: [initialSystemMsg] }));
    setSelectedConvId(newConvId);
  };

  const handleEditContact = (leadId: string, updatedData: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updatedData } : l))
    );

    setConversations((prev) =>
      prev.map((c) => {
        if (c.leadId === leadId) {
          return {
            ...c,
            leadName: updatedData.name || c.leadName,
            phone: updatedData.phone || c.phone,
            stage: updatedData.stage || c.stage,
            assignedAgentId: updatedData.assignedAgentId || c.assignedAgentId,
            assignedAgentName: updatedData.assignedAgentName || c.assignedAgentName,
            tags: updatedData.tags || c.tags
          };
        }
        return c;
      })
    );
  };

  const handleDeleteContact = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    setConversations((prev) => prev.filter((c) => c.leadId !== leadId));
  };

  // Launch Campaign
  const handleLaunchCampaign = (cmpData: Partial<Campaign>) => {
    const newCmp: Campaign = {
      id: `cmp_${Date.now()}`,
      name: cmpData.name || 'New Broadcast Campaign',
      templateId: cmpData.templateId || templates[0].id,
      templateName: cmpData.templateName || templates[0].name,
      targetSegment: cmpData.targetSegment || 'All Leads',
      totalRecipients: cmpData.totalRecipients || 500,
      sentCount: cmpData.sentCount || 500,
      deliveredCount: cmpData.deliveredCount || 480,
      readCount: cmpData.readCount || 390,
      repliedCount: cmpData.repliedCount || 95,
      status: 'COMPLETED',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCampaigns((prev) => [newCmp, ...prev]);
  };

  // Create Template
  const handleCreateTemplate = (tmpl: WhatsAppTemplate) => {
    setTemplates((prev) => [tmpl, ...prev]);
  };

  // Create Automation Rule
  const handleCreateRule = (rule: AutomationRule) => {
    setAutomationRules((prev) => [rule, ...prev]);
  };

  const handleToggleRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  // AI Copilot Modal Custom Prompt Submit
  const handleRunAiCopilotPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCustomPrompt.trim()) return;
    setLoadingAiCustom(true);
    try {
      const response = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: [{ text: aiCustomPrompt }],
          leadName: 'Prospect',
          agentName: currentAgent.name
        })
      });
      const data = await response.json();
      if (data.suggestions) {
        setAiCustomResult(data.suggestions.join('\n\n'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAiCustom(false);
    }
  };

  const handleCreateErpSalesOrder = (newOrder: ErpSalesOrder) => {
    setErpSalesOrders((prev) => [newOrder, ...prev]);
  };

  const handleCreateErpItem = (newItem: ErpItem) => {
    setErpItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateTableStatus = (tableId: string, newStatus: RestaurantTable['status']) => {
    setRestaurantTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, status: newStatus } : t))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: RestaurantOrderStatus) => {
    setRestaurantOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleCreateRestaurantOrder = (newOrder: RestaurantOrder) => {
    setRestaurantOrders(prev => [newOrder, ...prev]);
  };

  const handleToggleMenuItemAvailability = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(m => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  const handleCreateEcommerceProduct = (newProduct: EcommerceProduct) => {
    setEcommerceProducts(prev => [newProduct, ...prev]);
  };

  const handleCreateStoreOrder = (newOrder: StoreOrder) => {
    setStoreOrders(prev => [newOrder, ...prev]);
  };

  const handleCreateClusterSite = (newSite: SaaSClusterSite) => {
    setSaasClusterSites(prev => [newSite, ...prev]);
  };

  const handleUpdateClusterSiteStatus = (siteId: string, status: ClusterSiteStatus) => {
    setSaasClusterSites(prev =>
      prev.map(s => (s.id === siteId ? { ...s, status } : s))
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden antialiased">
      {/* Top Header */}
      <Header
        tenant={tenant}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAIModal={() => setShowAiCopilotModal(true)}
        onOpenActivityStream={() => setShowActivityDrawer(true)}
        activeTab={activeTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Body Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          agents={agents}
          currentAgent={currentAgent}
          setCurrentAgent={setCurrentAgent}
          unreadCountTotal={unreadCountTotal}
        />

        {/* View Router */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 text-slate-900 overflow-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              leads={leads}
              conversations={conversations}
              agents={agents}
              erpSalesOrders={erpSalesOrders}
              erpInvoices={erpInvoices}
              analytics={analytics}
              setActiveTab={setActiveTab}
              currentAgent={currentAgent}
            />
          )}

          {activeTab === 'inbox' && (
            <InboxView
              conversations={conversations}
              messages={messages}
              leads={leads}
              agents={agents}
              templates={templates}
              knowledgeDocs={knowledgeDocs}
              currentAgent={currentAgent}
              selectedConvId={selectedConvId}
              setSelectedConvId={setSelectedConvId}
              onSendMessage={handleSendMessage}
              onUpdateLeadStage={handleUpdateLeadStage}
              onAssignAgent={handleAssignAgent}
              onToggleManagedBy={handleToggleConversationManagedBy}
              onOpenDelegateModal={handleOpenDelegateModal}
            />
          )}

          {activeTab === 'segments' && (
            <CustomerSegmentsView
              segments={segments}
              leads={leads}
              agents={agents}
              onCreateSegment={handleCreateSegment}
              onUpdateSegment={handleUpdateSegment}
              onDeleteSegment={handleDeleteSegment}
              onNavigateToBroadcast={(segmentName) => {
                setActiveTab('broadcasts');
              }}
              onOpenDelegateModal={handleOpenDelegateModal}
            />
          )}

          {activeTab === 'ai_agents' && (
            <AiAgentsView agents={agents} currentAgent={currentAgent} />
          )}

          {activeTab === 'ai_boardroom' && (
            <AiBoardroomView />
          )}

          {activeTab === 'virtual_office' && (
            <VirtualOfficeView agents={agents} currentAgent={currentAgent} />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureBlueprintView />
          )}

          {activeTab === 'n8n_flow' && (
            <N8nFlowEditorView />
          )}

          {activeTab === 'clientum_os_hub' && (
            <ClientumOsHubView />
          )}

          {activeTab === 'chatbot' && (
            <ChatbotView
              config={chatbotConfig}
              agents={agents}
              onUpdateConfig={handleUpdateChatbotConfig}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsView
              leads={leads}
              agents={agents}
              conversations={conversations}
              messages={messages}
              templates={templates}
              currentAgent={currentAgent}
              onUpdateLeadStage={handleUpdateLeadStage}
              onAssignAgent={handleAssignAgent}
              onSendMessage={handleSendMessage}
              onCreateContact={handleCreateLead}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === 'pipeline' && (
            <PipelineView
              leads={leads}
              agents={agents}
              onUpdateLeadStage={handleUpdateLeadStage}
              onSelectLeadForChat={handleSelectLeadForChat}
              onCreateLead={handleCreateLead}
              onOpenDelegateModal={handleOpenDelegateModal}
            />
          )}

          {activeTab === 'erp' && (
            <ErpView
              items={erpItems}
              salesOrders={erpSalesOrders}
              invoices={erpInvoices}
              leads={leads}
              onCreateSalesOrder={handleCreateErpSalesOrder}
              onCreateItem={handleCreateErpItem}
            />
          )}

          {activeTab === 'restaurant' && (
            <RestaurantView
              tables={restaurantTables}
              menuItems={menuItems}
              orders={restaurantOrders}
              onUpdateTableStatus={handleUpdateTableStatus}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onCreateOrder={handleCreateRestaurantOrder}
              onToggleMenuItemAvailability={handleToggleMenuItemAvailability}
            />
          )}

          {activeTab === 'ecommerce' && (
            <EcommerceView
              products={ecommerceProducts}
              storeOrders={storeOrders}
              onCreateProduct={handleCreateEcommerceProduct}
              onCreateStoreOrder={handleCreateStoreOrder}
            />
          )}

          {activeTab === 'cluster' && (
            <SaaSClusterView
              sites={saasClusterSites}
              geoData={geoStatesAndCities}
              onCreateSite={handleCreateClusterSite}
              onUpdateSiteStatus={handleUpdateClusterSiteStatus}
            />
          )}

          {activeTab === 'sites' && (
            <SitesView />
          )}

          {activeTab === 'subscriptions' && (
            <SubscriptionsView />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppBaileysSettings />
          )}

          {activeTab === 'theme' && (
            <SaaSThemeView
              themeConfig={saasThemeConfig}
              onUpdateThemeConfig={(newConfig) => setSaasThemeConfig(newConfig)}
            />
          )}

          {activeTab === 'broadcasts' && (
            <BroadcastsView
              campaigns={campaigns}
              templates={templates}
              leads={leads}
              onLaunchCampaign={handleLaunchCampaign}
            />
          )}

          {activeTab === 'templates' && (
            <TemplateView
              templates={templates}
              onCreateTemplate={handleCreateTemplate}
            />
          )}

          {activeTab === 'automation' && (
            <AutomationView
              rules={automationRules}
              templates={templates}
              agents={agents}
              onCreateRule={handleCreateRule}
              onToggleRule={handleToggleRule}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeBaseView
              knowledgeDocs={knowledgeDocs}
              onAddKnowledgeDoc={handleAddKnowledgeDoc}
              onDeleteKnowledgeDoc={handleDeleteKnowledgeDoc}
              currentAgent={currentAgent}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView analytics={analytics} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              tenant={tenant}
              agents={agents}
              auditLogs={auditLogs}
              onUpdateTenant={(updated) => setTenant((prev) => ({ ...prev, ...updated }))}
              onUpdateAgents={(updatedAgents) => setAgents(updatedAgents)}
            />
          )}
        </main>
      </div>

      {/* Bottom Real-Time Activity Stream Ticker Footer */}
      <footer className="h-10 bg-slate-900 text-slate-300 px-4 md:px-6 flex items-center justify-between text-[10px] font-mono tracking-wider shrink-0 border-t border-slate-800">
        <div className="flex items-center space-x-4 overflow-hidden">
          <button
            onClick={() => setShowActivityDrawer(true)}
            className="flex items-center space-x-1.5 text-green-400 font-bold hover:underline shrink-0"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Activity Stream ERP:</span>
          </button>
          {activityStream[0] && (
            <span className="text-slate-300 truncate">
              <b>{activityStream[0].agentName}</b> {activityStream[0].description} ({activityStream[0].timestamp})
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <button
            onClick={() => setShowActivityDrawer(true)}
            className="text-slate-400 hover:text-white underline font-semibold hidden sm:inline"
          >
            Ver {activityStream.length} eventos en vivo
          </button>
          <span className="text-green-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            ERPNext Live Sync
          </span>
        </div>
      </footer>

      {/* Modal & Drawer Components */}
      <DelegateTaskModal
        isOpen={showDelegateModal}
        onClose={() => setShowDelegateModal(false)}
        agents={agents}
        currentAgent={currentAgent}
        itemToDelegate={itemToDelegate}
        onConfirmDelegation={handleConfirmDelegation}
      />

      <ActivityStreamDrawer
        isOpen={showActivityDrawer}
        onClose={() => setShowActivityDrawer(false)}
        activities={activityStream}
        onTriggerMockAction={handleTriggerMockActivity}
      />

      {/* Global AI Copilot Modal Drawer */}
      {showAiCopilotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-emerald-400 animate-pulse" />
                Copiloto de Ventas IA Gemini
              </h3>
              <button onClick={() => setShowAiCopilotModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Consultá a Gemini IA para redactar mensajes de prospección por WhatsApp, rebatir objeciones de clientes o generar guiones de venta para Clientum CRM.
            </p>

            <form onSubmit={handleRunAiCopilotPrompt} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tu Consulta o Disparador para la IA</label>
                <textarea
                  rows={3}
                  value={aiCustomPrompt}
                  onChange={(e) => setAiCustomPrompt(e.target.value)}
                  placeholder="ej. Redactá un seguimiento amigable por WhatsApp para un cliente que no respondió la propuesta de Clientum CRM en 3 días..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loadingAiCustom || !aiCustomPrompt.trim()}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loadingAiCustom ? 'Generando...' : 'Generar Orientación IA'}</span>
                </button>
              </div>
            </form>

            {aiCustomResult && (
              <div className="p-3 bg-slate-950 rounded-lg border border-emerald-800/60 text-xs text-emerald-200 space-y-2 max-h-48 overflow-y-auto">
                <p className="font-bold text-emerald-400">Recomendación de la IA:</p>
                <p className="whitespace-pre-wrap">{aiCustomResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global AI Assistant Floating Modal */}
      <AiAssistantModal
        isOpen={showAiCopilotModal}
        onClose={() => setShowAiCopilotModal(false)}
      />

      {/* SaaS User Login & Registration Modal */}
      <AuthModal
        isOpen={showAuthModal || !currentUser}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

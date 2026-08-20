export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export type Role = 'admin' | 'manager' | 'agent';

// Channel Preferences for Customer Segmentation
export type CommunicationChannel = 'WhatsApp' | 'Email' | 'SMS' | 'Phone' | 'Live Chat' | 'Instagram';

export interface SegmentCriteria {
  minAmountSpent?: number;
  maxAmountSpent?: number;
  lastPurchaseDays?: number; // e.g. 30, 60, 90, 180
  lastPurchaseRelation?: 'within_days' | 'older_than_days' | 'no_purchases' | 'any';
  channelPreferences?: CommunicationChannel[];
  leadStages?: LeadStage[];
  tags?: string[];
  city?: string;
  minScore?: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  color: string; // Tailwind color or hex
  icon?: string;
  createdAt: string;
  updatedAt: string;
  contactCount?: number;
  avgLifetimeValue?: number;
}

// AI Chatbot & Handover Types
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'CRM Features' | 'WABA & WhatsApp' | 'Precios & Facturación' | 'Integraciones ERP' | 'Soporte General';
  keywords: string[];
  isLeadCollectTrigger?: boolean;
}

export interface LeadCollectedData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  interest?: string;
  capturedAt?: string;
}

export interface ChatbotHandoverRule {
  id: string;
  name: string;
  condition: 'explicit_agent_request' | 'high_value_lead' | 'unanswered_faq_count' | 'negative_sentiment' | 'custom_keyword';
  threshold?: number | string;
  action: 'assign_human_agent' | 'flag_urgent' | 'notify_slack';
  defaultAgentId?: string;
  isEnabled: boolean;
  description: string;
}

export interface ChatbotConfig {
  botName: string;
  welcomeMessage: string;
  isEnabled: boolean;
  fallbackToHuman: boolean;
  collectLeadInfo: boolean;
  leadFields: ('name' | 'email' | 'company' | 'phone' | 'interest')[];
  handoverRules: ChatbotHandoverRule[];
  faqs: FaqItem[];
  handoverCountTotal?: number;
  infoCollectedTotal?: number;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  isConnected: boolean;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  monthlyCredits: number;
  creditsUsed: number;
  webhookUrl: string;
  webhookSecret: string;
}

export interface AgentPermissions {
  canCreateCampaigns: boolean;
  canUseAiCopilot: boolean;
  canManageTemplates: boolean;
  canExportLeads: boolean;
  canManageErpOrders: boolean;
  canManageCluster: boolean;
  canViewAnalytics: boolean;
}

export interface AgentGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'In Progress' | 'Achieved' | 'At Risk';
}

export interface AgentTask {
  id: string;
  title: string;
  leadId?: string;
  leadName?: string;
  convId?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedAt: string;
  dueDate: string;
  notes?: string;
  assignedBy?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  status: 'online' | 'busy' | 'offline';
  assignedLeadsCount: number;
  permissions?: AgentPermissions;
  goals?: AgentGoal[];
  active_tasks?: AgentTask[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  dealValue: number;
  stage: LeadStage;
  source: 'WhatsApp' | 'Meta Ads' | 'Website' | 'Manual' | 'Referral';
  assignedAgentId?: string;
  assignedAgentName?: string;
  tags: string[];
  lastContacted: string;
  notes: string;
  score: number; // 0-100 AI Intent Score
  summary?: string;
  city?: string;
  unreadCount?: number;
  
  // Segmentation fields
  totalAmountSpent?: number;
  lastPurchaseDate?: string;
  channelPreference?: CommunicationChannel;
}

export type MessageType = 'text' | 'image' | 'document' | 'audio' | 'template' | 'interactive';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  sender: 'lead' | 'agent' | 'system' | 'bot';
  senderName?: string;
  text: string;
  type: MessageType;
  mediaUrl?: string;
  mediaFileName?: string;
  timestamp: string;
  status: MessageStatus;
  templateName?: string;
  interactiveButtons?: string[];
  isNote?: boolean; // Internal team note
  scheduledAt?: string; // Scheduled delivery time
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  assignedAgentId?: string;
  assignedAgentName?: string;
  tags: string[];
  stage: LeadStage;
  pinned?: boolean;
  
  // Chatbot & Handover state
  managedBy?: 'bot' | 'human';
  handoverReason?: string;
  collectedLeadInfo?: LeadCollectedData;

  // Sentiment Analysis
  sentiment?: 'Happy' | 'Neutral' | 'Frustrated' | 'Inquisitive';
  sentimentScore?: number; // 0 to 100 positive score
  sentimentReason?: string;
  
  // Priority
  priority?: 'Urgent' | 'High' | 'Low';
}

export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
export type TemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';

export interface TemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  value?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  category: TemplateCategory;
  status: TemplateStatus;
  headerType?: 'NONE' | 'TEXT' | 'IMAGE' | 'DOCUMENT';
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: TemplateButton[];
  createdAt: string;
}

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'PAUSED';

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  targetSegment: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  status: CampaignStatus;
  scheduledAt?: string;
  createdAt: string;
}

export interface ABTestVariant {
  id: string;
  variantLetter: 'A' | 'B';
  name: string;
  templateId: string;
  templateName: string;
  samplePercentage: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  openRate: number;
  replyRate: number;
}

export interface ABTestCampaign {
  id: string;
  name: string;
  targetSegment: string;
  status: CampaignStatus;
  createdAt: string;
  variantA: ABTestVariant;
  variantB: ABTestVariant;
  winningMetric: 'open_rate' | 'reply_rate';
  winnerVariantId?: 'A' | 'B';
  notes?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerKeyword: string;
  matchType: 'exact' | 'contains' | 'any';
  actionType: 'send_template' | 'assign_agent' | 'update_stage' | 'ai_reply' | 'direct_text';
  actionValue: string;
  actionValueName?: string;
  replyText?: string;
  isEnabled: boolean;
}

export interface AnalyticsSummary {
  totalLeads: number;
  activeChats: number;
  broadcastMessagesSent: number;
  avgResponseTimeMinutes: number;
  conversionRate: number;
  messagesTrend: { date: string; incoming: number; outgoing: number }[];
  leadStagesCount: Record<LeadStage, number>;
}

export interface ErpItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  stockQty: number;
  unitPrice: number;
  uom: string;
  currency: string;
  imageUrl?: string;
}

export interface ErpDocumentItem {
  itemCode: string;
  itemName: string;
  qty: number;
  rate: number;
  amount: number;
}

export type ErpDocStatus = 'Draft' | 'Submitted' | 'Paid' | 'Invoiced' | 'Cancelled' | 'Overdue';

export interface ErpSalesOrder {
  id: string; // e.g. SAL-ORD-2026-0012
  customerName: string;
  customerPhone: string;
  postingDate: string;
  deliveryDate: string;
  grandTotal: number;
  status: ErpDocStatus;
  items: ErpDocumentItem[];
  currency: string;
  paymentUrl?: string;
}

export interface ErpInvoice {
  id: string; // e.g. ACC-SINV-2026-0089
  customerName: string;
  postingDate: string;
  dueDate: string;
  amount: number;
  outstandingAmount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  itemsCount: number;
}

export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Bill Requested';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  zone: 'Comedor Principal' | 'Terraza' | 'Bar & VIP' | 'Privado';
  status: TableStatus;
  currentOrderId?: string;
  assignedWaiter?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Platos Principales' | 'Bebidas & Cócteles' | 'Entradas' | 'Postres' | 'Menú Ejecutivo';
  price: number;
  description: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl?: string;
}

export type RestaurantOrderStatus = 'Pending' | 'Kitchen Preparing' | 'Ready to Serve' | 'Completed' | 'Cancelled';

export interface RestaurantOrder {
  id: string;
  orderType: 'Dine-in' | 'Takeaway' | 'Delivery' | 'WhatsApp QR';
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  items: { menuItemName: string; qty: number; price: number; notes?: string }[];
  status: RestaurantOrderStatus;
  totalAmount: number;
  timestamp: string;
  notes?: string;
}

export interface EcommerceProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  rating: number;
  imageUrl: string;
  badge?: string;
  description: string;
}

export interface StoreCartItem {
  product: EcommerceProduct;
  quantity: number;
}

export type StoreOrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Awaiting Payment';

export interface StoreOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: { productTitle: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: StoreOrderStatus;
  createdAt: string;
  paymentMethod: 'WhatsApp Direct' | 'Mercado Pago' | 'Credit Card' | 'Clientum Pay';
  frappeSalesOrderRef?: string;
}

export type ClusterSiteStatus = 'Active' | 'Provisioning' | 'Suspended' | 'Backup in Progress' | 'Maintenance';

export interface SaaSClusterSite {
  id: string;
  siteName: string;
  subdomain: string;
  databaseName: string;
  plan: 'Growth' | 'Professional' | 'Enterprise';
  status: ClusterSiteStatus;
  region: 'us-east1 (N. Virginia)' | 'sa-east1 (São Paulo)' | 'eu-west1 (Frankfurt)';
  storageUsedMb: number;
  storageMaxMb: number;
  usersUsed: number;
  usersMax: number;
  wabaMessagesUsed: number;
  wabaMessagesMax: number;
  createdAt: string;
}

export interface GeoStateCity {
  country: string;
  countryCode: string;
  stateName: string;
  cities: string[];
  fiscalTaxRate: number;
}

export interface SaaSUserSession {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  companyName: string;
  subdomain: string;
  plan: 'Growth' | 'Professional' | 'Enterprise';
  avatarUrl: string;
  isTwoFactorEnabled: boolean;
  lastLoginAt: string;
}

export interface SaaSThemeConfig {
  presetName: string;
  primaryColor: string;
  accentColor: string;
  sidebarStyle: 'Dark Glass' | 'Minimal Light' | 'Compact Icons';
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'Geist' | 'Outfit';
  brandLogoUrl: string;
  customCss: string;
  enableCustomNavbar: boolean;
  customFooterText: string;
  loginTheme: 'Centered Card' | 'Split Modern' | 'Minimal Slate';
  activeThemeId: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  action: string;
  category: 'AUTH' | 'CRM' | 'WHATSAPP' | 'ERP' | 'AGENT' | 'SYSTEM' | 'SECURITY';
  resource: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
  details: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Politicas' | 'Precios y Planes' | 'Soporte Técnico' | 'FAQS' | 'Procedimientos ERP';
  content: string;
  fileType?: string;
  tags: string[];
  embeddingVectorCount?: number;
  updatedAt: string;
  author: string;
  status: 'Indexed' | 'Processing' | 'Draft';
}

export interface ActivityStreamItem {
  id: string;
  timestamp: string;
  agentName: string;
  agentAvatar?: string;
  actionType: 'ERP_INVOICE' | 'ERP_SALES_ORDER' | 'LEAD_STAGE' | 'WHATSAPP_BROADCAST' | 'DELEGATION' | 'STORE_ORDER' | 'KNOWLEDGE_INDEX';
  description: string;
  resourceId?: string;
  status: 'Completed' | 'In Progress' | 'Alert' | 'Pending';
  timeAgo: string;
}

export type Site = SaaSClusterSite;
export type SiteStatus = ClusterSiteStatus;

export interface SiteBackup {
  id: string;
  siteId: string;
  createdAt: string;
  size: string;
  type: 'full' | 'incremental';
}

export interface BenchNode {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline';
}

export type PlanTier = 'starter' | 'professional' | 'enterprise';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  maxUsers: number;
  maxDiskMB: number;
  backgroundWorkers: number;
  backupFrequency: string;
  includedApps: string[];
}

export interface SubscriptionRecord {
  id: string;
  tenantId: string;
  plan: PlanTier;
  status: 'active' | 'cancelled' | 'past_due';
  nextBillingDate: string;
  amount: number;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
}

// ==========================================
// RBAC (Role-Based Access Control) Types
// ==========================================
export type PermissionScope = 'all' | 'team' | 'assigned_only';

export interface EntityPermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  scope: PermissionScope;
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean; // Default system role vs custom
  permissions: {
    leads: EntityPermission;
    contacts: EntityPermission;
    companies: EntityPermission;
    deals: EntityPermission;
    automations: EntityPermission;
    settings: EntityPermission;
  };
}

// ==========================================
// Email Integration Types (Gmail & Outlook)
// ==========================================
export type EmailProvider = 'gmail' | 'outlook';

export interface EmailAccount {
  id: string;
  provider: EmailProvider;
  email: string;
  displayName: string;
  isConnected: boolean;
  connectedAt: string;
  isDefault?: boolean;
  syncStatus: 'active' | 'syncing' | 'error';
  lastSyncedAt?: string;
}

export interface EmailMessageRecord {
  id: string;
  contactId?: string;
  dealId?: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  direction: 'sent' | 'received';
  provider: EmailProvider;
  timestamp: string;
  status: 'delivered' | 'opened' | 'replied' | 'failed';
  attachments?: { fileName: string; fileSize: string; fileType: string; url: string }[];
}

export interface EmailTemplateItem {
  id: string;
  title: string;
  subject: string;
  body: string;
  category: 'Sales' | 'Follow-up' | 'Onboarding' | 'Support';
}

// ==========================================
// Workflow Automation Engine Types
// ==========================================
export type WorkflowTriggerType = 
  | 'new_lead_created'
  | 'deal_stage_changed'
  | 'contact_updated'
  | 'email_received'
  | 'inactivity_period'
  | 'whatsapp_received';

export type WorkflowActionType =
  | 'send_email_notification'
  | 'send_whatsapp_message'
  | 'create_followup_task'
  | 'assign_lead_to_user'
  | 'update_field'
  | 'add_tag'
  | 'trigger_webhook';

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string;
}

export interface WorkflowActionStep {
  id: string;
  type: WorkflowActionType;
  config: {
    recipientEmail?: string;
    emailSubject?: string;
    emailBody?: string;
    whatsappMessage?: string;
    taskTitle?: string;
    taskDueDateDays?: number;
    assignedAgentId?: string;
    updateFieldKey?: string;
    updateFieldValue?: string;
    tagToAdd?: string;
    webhookUrl?: string;
  };
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  triggerType: WorkflowTriggerType;
  triggerConfig?: {
    fromStage?: LeadStage;
    toStage?: LeadStage;
    daysInactive?: number;
  };
  conditions: WorkflowCondition[];
  actions: WorkflowActionStep[];
  executionCount: number;
  lastExecutedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  triggerType: WorkflowTriggerType;
  targetRecordName: string;
  targetRecordId: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Pending';
  actionsExecutedCount: number;
  details: string;
}

// ==========================================
// Google Maps Integration Types
// ==========================================
export interface GoogleMapPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  rating?: number;
  phoneNumber?: string;
  website?: string;
  distanceKm?: number;
}

export interface RouteDirection {
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  steps: string[];
}

// ==========================================
// clientum-os Architecture & Advanced Types
// ==========================================
export interface DiscussionMessage {
  id: string;
  senderName: string;
  senderRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'advisor' | 'ai_summary' | 'action_plan' | 'user';
  recommendations?: string[];
}

export interface EnrichmentLog {
  id: string;
  targetEmail: string;
  companyName: string;
  linkedinUrl?: string;
  status: 'completed' | 'enriching' | 'failed';
  dataPointsFound: number;
  provider: 'OpenRouter' | 'Perplexity' | 'LinkedIn API';
  timestamp: string;
  summary: string;
}

export interface BoardroomAdvisor {
  id: string;
  name: string;
  role: 'CEO' | 'CMO' | 'CTO' | 'CFO' | 'COO';
  avatar: string;
  personality: string;
  focusArea: string;
  aiModel: string;
  status: 'active' | 'thinking' | 'idle';
}

export interface BoardroomSession {
  id: string;
  title: string;
  topic: string;
  status: 'in_progress' | 'completed' | 'draft';
  createdAt: string;
  messages: DiscussionMessage[];
  keyDecisions: string[];
}

export interface VirtualOfficeRoom {
  id: string;
  name: string;
  type: 'executive' | 'dev_lab' | 'sales_floor' | 'lounge' | 'support_center';
  capacity: number;
  activeAgents: string[];
  currentActivity: string;
  statusColor: string;
}

export interface ArchitectureServiceNode {
  id: string;
  name: string;
  type: 'api' | 'db' | 'cache' | 'ai' | 'gateway' | 'queue' | 'worker';
  status: 'healthy' | 'degraded' | 'offline';
  latencyMs: number;
  memoryUsageMb: number;
  version: string;
  region: string;
  connections: string[];
}

export interface SystemBackupPoint {
  id: string;
  name: string;
  type: 'automated' | 'manual';
  sizeMb: number;
  collectionsCount: number;
  createdAt: string;
  status: 'ready' | 'restoring' | 'archived';
  location: string;
}

export interface BenchInstance {
  id: string;
  siteName: string;
  domain: string;
  frappeVersion: string;
  status: 'running' | 'deploying' | 'paused' | 'error';
  databaseSizeMb: number;
  tenantName: string;
  sslActive: boolean;
  lastBackupAt: string;
}

export interface SystemTelemetryLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  durationMs?: number;
}

export interface CustomerPortalTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category: string;
  createdAt: string;
  lastResponseAt: string;
  messagesCount: number;
}





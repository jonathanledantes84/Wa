import React, { useState } from 'react';
import { Mail, Send, Inbox, Paperclip, ChevronDown, ChevronUp, Plus, Clock, CheckCheck, RefreshCw } from 'lucide-react';
import { EmailMessageRecord, EmailAccount } from '../types';

interface EmailHistoryViewProps {
  contactId?: string;
  dealId?: string;
  emailRecords: EmailMessageRecord[];
  emailAccounts: EmailAccount[];
  onOpenComposer: () => void;
}

export const EmailHistoryView: React.FC<EmailHistoryViewProps> = ({
  contactId,
  dealId,
  emailRecords,
  emailAccounts,
  onOpenComposer
}) => {
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  // Filter messages linked to this contact or deal
  const filteredEmails = emailRecords.filter(
    (e) => (contactId && e.contactId === contactId) || (dealId && e.dealId === dealId)
  );

  const toggleExpand = (id: string) => {
    setExpandedEmailId(expandedEmailId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Historial de Correos Electrónicos ({filteredEmails.length})
          </h4>
        </div>
        <button
          onClick={onOpenComposer}
          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enviar Email</span>
        </button>
      </div>

      {/* Connected Accounts Info */}
      <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <span className="font-bold text-slate-700">Cuentas vinculadas:</span>
        {emailAccounts.filter((a) => a.isConnected).map((acc) => (
          <span
            key={acc.id}
            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
              acc.provider === 'gmail'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {acc.provider === 'gmail' ? '🔴 Gmail:' : '🟦 Outlook:'} {acc.email}
          </span>
        ))}
      </div>

      {/* Email Timeline */}
      {filteredEmails.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
          <Mail className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-600 font-bold">No hay correos registrados para este contacto.</p>
          <p className="text-[11px] text-slate-400">
            Envíe una propuesta comercial o vincule correos recibidos desde Gmail / Outlook.
          </p>
          <button
            onClick={onOpenComposer}
            className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <span>Redactar primer correo ahora &rarr;</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((msg) => {
            const isSent = msg.direction === 'sent';
            const isExpanded = expandedEmailId === msg.id;

            return (
              <div
                key={msg.id}
                className={`border rounded-xl bg-white transition shadow-sm overflow-hidden ${
                  isSent ? 'border-slate-200' : 'border-blue-200 bg-blue-50/20'
                }`}
              >
                {/* Header item */}
                <div
                  onClick={() => toggleExpand(msg.id)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSent ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isSent ? <Send className="w-4 h-4" /> : <Inbox className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {msg.subject}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                            msg.provider === 'gmail'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {msg.provider}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {isSent ? `Para: ${msg.recipientName} (${msg.recipientEmail})` : `De: ${msg.senderName} (${msg.senderEmail})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {msg.timestamp}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 uppercase">
                        {msg.status}
                      </span>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Body Content */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-800 leading-relaxed space-y-3 font-sans">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap shadow-inner">
                      {msg.body}
                    </div>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 mb-1">Archivos Adjuntos:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.attachments.map((att, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded flex items-center space-x-1.5 text-xs">
                              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold text-slate-700">{att.fileName}</span>
                              <span className="text-[10px] text-slate-400">({att.fileSize})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

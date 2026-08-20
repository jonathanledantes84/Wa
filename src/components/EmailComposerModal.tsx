import React, { useState } from 'react';
import { X, Send, Paperclip, Mail, Sparkles, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { EmailAccount, EmailMessageRecord, EmailTemplateItem, Lead } from '../types';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Lead | null;
  emailAccounts: EmailAccount[];
  emailTemplates: EmailTemplateItem[];
  onSendEmail: (emailRecord: Omit<EmailMessageRecord, 'id' | 'timestamp'>) => void;
}

export const EmailComposerModal: React.FC<EmailComposerModalProps> = ({
  isOpen,
  onClose,
  contact,
  emailAccounts,
  emailTemplates,
  onSendEmail
}) => {
  if (!isOpen) return null;

  const connectedAccounts = emailAccounts.filter((a) => a.isConnected);
  const defaultAccount = connectedAccounts.find((a) => a.isDefault) || connectedAccounts[0] || emailAccounts[0];

  const [selectedAccountId, setSelectedAccountId] = useState<string>(defaultAccount?.id || '');
  const [recipientEmail, setRecipientEmail] = useState<string>(contact?.email || 'cliente@empresa.com');
  const [recipientName, setRecipientName] = useState<string>(contact?.name || 'Cliente');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [attachments, setAttachments] = useState<{ fileName: string; fileSize: string; fileType: string; url: string }[]>([]);
  const [sentSuccess, setSentSuccess] = useState(false);

  const activeAccount = emailAccounts.find((a) => a.id === selectedAccountId) || defaultAccount;

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = emailTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;

    let parsedSubject = tmpl.subject;
    let parsedBody = tmpl.body;

    if (contact) {
      parsedSubject = parsedSubject.replace('{{contactName}}', contact.name).replace('{{companyName}}', contact.company);
      parsedBody = parsedBody.replace(/{{contactName}}/g, contact.name).replace(/{{companyName}}/g, contact.company);
    }

    setSubject(parsedSubject);
    setBody(parsedBody);
  };

  const handleAiRefineEmail = async () => {
    if (!body.trim() && !subject.trim()) return;
    setIsAiGenerating(true);

    try {
      const response = await fetch('/api/ai/refine-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: body || subject,
          tone: 'profesional y persuasivo de ventas'
        })
      });
      const data = await response.json();
      if (data.refinedText) {
        setBody(data.refinedText);
      }
    } catch (e) {
      console.error('Error refining email:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAttachFile = () => {
    const fakeAttachment = {
      fileName: `Propuesta_Comercial_${contact?.company || 'CRM'}.pdf`,
      fileSize: '1.4 MB',
      fileType: 'pdf',
      url: '#'
    };
    setAttachments([...attachments, fakeAttachment]);
  };

  const handleSubmitSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body || !recipientEmail) return;

    onSendEmail({
      contactId: contact?.id,
      dealId: contact?.id,
      senderEmail: activeAccount.email,
      senderName: activeAccount.displayName.split(' ')[0] || 'Vendedor',
      recipientEmail,
      recipientName,
      subject,
      body,
      direction: 'sent',
      provider: activeAccount.provider,
      status: 'delivered',
      attachments: attachments.length > 0 ? attachments : undefined
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Redactar y Enviar Email CRM</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-800">¡Email Enviado con Éxito!</h4>
            <p className="text-xs text-slate-500">
              El correo se envió vía {activeAccount.provider === 'gmail' ? 'Google Workspace Gmail' : 'Microsoft Outlook'} y quedó registrado en el historial del contacto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitSend} className="p-6 space-y-4">
            {/* Sender & Provider selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enviar desde cuenta (OAuth 2.0)
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {emailAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.provider === 'gmail' ? '🔴 Gmail:' : '🟦 Outlook:'} {acc.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plantillas Predefinidas
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Seleccionar plantilla...</option>
                  {emailTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.category}] {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recipient */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Destinatario
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Asunto del Correo
              </label>
              <input
                type="text"
                placeholder="Ej. Propuesta Comercial y Cotización Especial"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                required
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Cuerpo del Mensaje
                </label>
                <button
                  type="button"
                  onClick={handleAiRefineEmail}
                  disabled={isAiGenerating}
                  className="text-[11px] text-purple-700 hover:text-purple-900 font-bold flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded border border-purple-200 transition"
                >
                  <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
                  <span>{isAiGenerating ? 'Mejorando texto con Gemini...' : 'Perfeccionar con IA'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escriba aquí el contenido del correo..."
                className="w-full border border-slate-300 rounded-lg p-3 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
                required
              />
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-600">Archivos adjuntos:</p>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded text-xs text-slate-700 flex items-center space-x-2">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold">{att.fileName}</span>
                      <span className="text-[10px] text-slate-400">({att.fileSize})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAttachFile}
                className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 transition"
              >
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span>Adjuntar Documento</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Email ({activeAccount.provider.toUpperCase()})</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

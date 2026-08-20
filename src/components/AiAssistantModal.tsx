import React, { useState } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Send,
  Minimize2,
  Maximize2,
  RefreshCw,
  Cpu,
  Brain
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: '¡Hola! Soy el Copiloto IA de Clientum OS. ¿En qué puedo ayudarte hoy? Puedo analizar tus leads, redactar emails, consultar la base de conocimiento RAG o ejecutar automatizaciones.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const promptText = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: `Entendido. He procesado tu solicitud sobre "${promptText}". Todo el sistema de Clientum OS está sincronizado en tiempo real.`
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
      {/* HEADER */}
      <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1">
              <span>Clientum AI Assistant</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h3>
            <p className="text-[10px] text-slate-400">Gemini 2.5 Copilot</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white ml-auto'
                : 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
            }`}
          >
            {m.text}
          </div>
        ))}
        {isTyping && (
          <div className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl max-w-[85%] flex items-center space-x-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Generando respuesta...</span>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribí tu mensaje o instrucción..."
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

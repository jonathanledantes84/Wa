import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getAIClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        aiClient = new GoogleGenAI({ apiKey });
      }
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Frappe WhatsApp SaaS CRM' });
  });

  // AI Endpoint: Grounding Search (Search & Maps)
  app.post('/api/ai/grounding-search', async (req, res) => {
    try {
      const { prompt } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.status(500).json({ error: 'AI client not configured' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [
            { googleSearchRetrieval: {} }
          ]
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('AI grounding search error:', error);
      res.status(500).json({ error: error.message || 'Failed to perform grounding search' });
    }
  });

  // AI Endpoint: Priority Analysis
  app.post('/api/ai/analyze-priority', async (req, res) => {
    try {
      const { content, stage } = req.body;
      const ai = getAIClient();
      if (!ai) return res.status(500).json({ error: 'AI client not configured' });

      const prompt = `Analyze the priority of this conversation for a CRM. 
      Stage: ${stage}
      Content: ${content}
      
      Classify as "Urgent", "High", or "Low" priority based on urgency and lead stage.
      Return ONLY the word: Urgent, High, or Low.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt
      });
      
      const priority = response.text?.trim() as 'Urgent' | 'High' | 'Low';
      res.json({ priority });
    } catch (error: any) {
      console.error('AI priority analysis error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze priority' });
    }
  });

  // AI Endpoint: Chat Interface (Multi-turn)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history, model, systemInstruction } = req.body;
      const ai = getAIClient();
      if (!ai) return res.status(500).json({ error: 'AI client not configured' });

      // Use the appropriate model based on task complexity
      const modelName = model || 'gemini-3.5-flash';
      
      const chat = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction: systemInstruction || "You are a helpful assistant."
        }
      });
      
      // Load history if needed (simplified for this example)
      // For persistent history, you would load/save from Firestore here.
      
      const response = await chat.sendMessage({ message });
      res.json({ response: response.text });
    } catch (error: any) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: error.message || 'Failed to chat' });
    }
  });

  // AI Endpoint: Transcription
  app.post('/api/ai/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      const ai = getAIClient();
      if (!ai) return res.status(500).json({ error: 'AI client not configured' });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: {
          parts: [
            { text: "Transcribe this audio precisely." },
            { inlineData: { data: audioBase64, mimeType } }
          ]
        }
      });
      res.json({ transcription: response.text });
    } catch (error: any) {
      console.error('AI transcription error:', error);
      res.status(500).json({ error: error.message || 'Failed to transcribe' });
    }
  });

  // AI Endpoint: Smart WhatsApp Reply Generator
  app.post('/api/ai/suggest-reply', async (req, res) => {
    try {
      const { chatHistory, leadName, company, agentName } = req.body;
      const ai = getAIClient();

      if (!ai) {
        // Fallback response if Gemini API key is not configured
        return res.json({
          suggestions: [
            `Hi ${leadName}! Thank you for your message. How can I assist you with Frappe CRM today?`,
            `Hello ${leadName}, I reviewed your inquiry regarding ${company || 'our services'}. Would you like to schedule a 10-minute demo?`,
            `Thanks for reaching out! Here is a link to our WhatsApp WABA setup guide: https://frappecrm.io/waba-docs`
          ]
        });
      }

      const prompt = `You are an AI Sales Assistant for Frappe WhatsApp SaaS CRM.
Lead Name: ${leadName || 'Valued Lead'}
Company: ${company || 'N/A'}
Agent Name: ${agentName || 'Sales Representative'}

Recent WhatsApp Conversation History:
${JSON.stringify(chatHistory, null, 2)}

Task: Provide 3 short, professional, friendly, and high-converting WhatsApp reply options that ${agentName} can send to ${leadName}.
Keep replies concise, formatted cleanly for WhatsApp (with optional emojis), and actionable.
Return JSON array format: ["Option 1", "Option 2", "Option 3"]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '[]';
      let suggestions = [];
      try {
        suggestions = JSON.parse(text);
      } catch (e) {
        suggestions = [
          `Hi ${leadName}, thanks for your message! How can I help you today?`,
          `Hello ${leadName}, happy to provide more details about our WhatsApp CRM features.`,
          `Thanks for reaching out! Would you be free for a quick call today?`
        ];
      }

      res.json({ suggestions });
    } catch (error: any) {
      console.error('AI suggest reply error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI replies' });
    }
  });

  // AI Endpoint: Text Tone Refiner
  app.post('/api/ai/refine-text', async (req, res) => {
    try {
      const { text, tone } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({ refinedText: text }); // Fallback
      }

      const prompt = `Rewrite the following text to have a ${tone} tone. Keep it suitable for a WhatsApp message.
Text: "${text}"

Output ONLY the refined text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      res.json({ refinedText: response.text?.trim() || text });
    } catch (error: any) {
      console.error('AI refine text error:', error);
      res.status(500).json({ error: error.message || 'Failed to refine text' });
    }
  });

  // AI Endpoint: Lead Qualification & Sentiment Analysis
  app.post('/api/ai/qualify-lead', async (req, res) => {
    try {
      const { chatHistory, leadName } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          score: 85,
          summary: 'High purchase intent expressed for multi-agent WhatsApp inbox.',
          recommendedStage: 'Qualified',
          keyTakeaways: ['Wants multi-agent workspace', 'Budget approved', 'Needs fast implementation']
        });
      }

      const prompt = `Analyze this WhatsApp chat with lead "${leadName}":
${JSON.stringify(chatHistory, null, 2)}

Provide JSON response with:
1. "score": number from 0 to 100 (Intent score)
2. "summary": short 1-2 sentence executive summary
3. "recommendedStage": string choice from ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"]
4. "keyTakeaways": string array of 3 key pain points or requirements

Respond strictly in JSON format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error: any) {
      console.error('AI qualify lead error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze lead' });
    }
  });

  // AI Endpoint: Broadcast Campaign Copywriting
  app.post('/api/ai/generate-campaign', async (req, res) => {
    try {
      const { campaignGoal, targetAudience, tone } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          headerText: 'Exclusive WhatsApp Upgrade Offer 🚀',
          bodyText: `Hi {{1}}, boost your team's sales speed by 3x with automated WhatsApp CRM workflows! Claim 2,000 free broadcast credits today.`,
          footerText: 'Frappe CRM Growth Plan',
          buttons: [
            { type: 'QUICK_REPLY', text: 'Claim Offer Now' },
            { type: 'QUICK_REPLY', text: 'Talk to Sales' }
          ]
        });
      }

      const prompt = `Create a Meta-approved WhatsApp Broadcast Template for marketing.
Goal: ${campaignGoal}
Target Audience: ${targetAudience}
Tone: ${tone || 'Professional & Engaging'}

Output JSON schema:
{
  "headerText": "Short catchy header (max 60 chars)",
  "bodyText": "Body text with {{1}} variable for lead name",
  "footerText": "Short footer disclaimer",
  "buttons": [
    {"type": "QUICK_REPLY", "text": "Button 1"},
    {"type": "QUICK_REPLY", "text": "Button 2"}
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error: any) {
      console.error('AI campaign copy error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate campaign copy' });
    }
  });

  // AI Endpoint: AI Chatbot, FAQ & Lead Collector Engine with Seamless Human Handover
  app.post('/api/ai/chatbot', async (req, res) => {
    try {
      const { messageText, chatHistory, currentLeadInfo, faqs, handoverRules } = req.body;
      const ai = getAIClient();

      const normalizedMsg = (messageText || '').toLowerCase().trim();

      // Step 1: Predefined FAQ Keyword Match Check
      let matchedFaq = null;
      if (Array.isArray(faqs)) {
        matchedFaq = faqs.find((f) => {
          if (!f.keywords || !Array.isArray(f.keywords)) return false;
          return f.keywords.some((kw: string) => normalizedMsg.includes(kw.toLowerCase()));
        });
      }

      // Step 2: Handover Rule Check (Explicit trigger words like "humano", "agente", "asesor", "soporte")
      const explicitHandoverTerms = ['humano', 'agente', 'asesor', 'persona', 'representante', 'soporte real', 'hablar con alguien'];
      const isExplicitHandover = explicitHandoverTerms.some((term) => normalizedMsg.includes(term));

      if (isExplicitHandover) {
        return res.json({
          botResponse: '🤖 Entendido. Te estoy transfiriendo inmediatamente con un agente de ventas humano de nuestro equipo. En breve tomará la conversación.',
          requiresHandover: true,
          handoverReason: 'Solicitud explícita de agente humano',
          extractedLeadInfo: {}
        });
      }

      // If Gemini AI is unavailable, use smart fallback matching
      if (!ai) {
        let responseText = matchedFaq
          ? matchedFaq.answer
          : `¡Hola! Gracias por comunicarte con Clientum CRM. He recibido tu consulta: "${messageText}". ¿Te gustaría conocer nuestros planes WABA o prefieres que un asesor te contacte?`;

        // Mock basic info extraction fallback
        const extracted: any = {};
        if (normalizedMsg.includes('mi nombre es') || normalizedMsg.includes('soy ')) {
          const words = messageText.split(' ');
          extracted.name = words[words.length - 1];
        }

        return res.json({
          botResponse: responseText,
          matchedFaq: matchedFaq ? matchedFaq.question : null,
          requiresHandover: false,
          handoverReason: null,
          extractedLeadInfo: extracted
        });
      }

      // Step 3: Server-side Gemini 3.6 Flash Processing
      const prompt = `You are the AI Chatbot for Clientum WhatsApp SaaS CRM.
Customer Message: "${messageText}"
Current Lead Known Info: ${JSON.stringify(currentLeadInfo || {})}
Configured FAQs: ${JSON.stringify(faqs || [])}

Tasks:
1. "botResponse": Provide a helpful, clear, and friendly answer formatted for WhatsApp. If an FAQ matches the query closely, draw directly from that answer.
2. "extractedLeadInfo": Extract any newly mentioned lead information from the customer's message (fields: "name", "email", "company", "phone", "interest"). Only return fields that are clearly provided or updated in this message.
3. "requiresHandover": boolean. Set to true if the customer expresses frustration, asks complex custom enterprise requirements, or explicitly requests human assistance.
4. "handoverReason": string or null explaining why handover was triggered.

Output JSON Format:
{
  "botResponse": "string",
  "extractedLeadInfo": { "name": "...", "email": "...", "company": "...", "interest": "..." },
  "requiresHandover": false,
  "handoverReason": null
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        botResponse: parsed.botResponse || '¡Gracias por tu mensaje! ¿En qué más puedo orientarte sobre Clientum CRM?',
        matchedFaq: matchedFaq ? matchedFaq.question : null,
        requiresHandover: parsed.requiresHandover || false,
        handoverReason: parsed.handoverReason || null,
        extractedLeadInfo: parsed.extractedLeadInfo || {}
      });
    } catch (error: any) {
      console.error('AI Chatbot processing error:', error);
      res.status(500).json({ error: error.message || 'Error processing chatbot query' });
    }
  });

  // Simulate Webhook trigger or incoming message test
  app.post('/api/whatsapp/webhook', (req, res) => {
    console.log('Incoming WhatsApp Webhook:', req.body);
    res.json({ status: 'received', timestamp: new Date().toISOString() });
  });

  // Vite middleware setup for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frappe WhatsApp CRM server running on http://localhost:${PORT}`);
  });
}

startServer();

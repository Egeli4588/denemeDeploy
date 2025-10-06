// Bu dosyanın tam yolu: api/chat.ts

import { GoogleGenAI, Chat } from "@google/genai";
import type { IncomingMessage, ServerResponse } from 'http';

// Bu fonksiyon Vercel tarafından her /api/chat isteğinde çalıştırılacak
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Sadece POST metoduyla gelen isteklere izin ver
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  
  // Vercel'in ortam değişkenlerinden API anahtarını güvenli bir şekilde al
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'API key not configured' }));
    return;
  }

  // İstek gövdesinden (body) gelen veriyi oku
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { message } = JSON.parse(body);
      if (!message) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Message is required' }));
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `Sen uzman bir Bilişim Teknolojileri öğretmenisin. Tüm cevapların bir ortaokul öğrencisinin anlayabileceği seviyede, bol örnekli ve 50 kelimeyi geçmeyecek şekilde olmalıdır. Sadece cevabı ver, ek açıklama yapma.`,
        },
      });

      const stream = await chat.sendMessageStream({ message });

      // Cevabı tarayıcıya stream olarak (parça parça) yolla
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      });

      for await (const chunk of stream) {
        res.write(chunk.text);
      }
      
      res.end(); // Stream bittiğinde bağlantıyı sonlandır

    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to communicate with Gemini API' }));
    }
  });
}

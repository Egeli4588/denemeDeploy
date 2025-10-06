// Bu dosyanın tam yolu: services/geminiService.ts

export async function* sendMessageStream(message: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'API isteği başarısız oldu.');
    } catch (e) {
        throw new Error(errorText || 'API isteği başarısız oldu.');
    }
  }

  // ReadableStream'i okumak için bir reader oluştur
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Yanıt alınamadı.');
  }

  const decoder = new TextDecoder();
  
  // Stream'den veri geldikçe yield ile dışarı aktar
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    yield decoder.decode(value);
  }
}

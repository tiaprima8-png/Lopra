import { GoogleGenAI, Type } from '@google/genai';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface AnalyzeRequest {
  youtubeUrl?: string;
  nicheTopic?: string;
  style?: string;
  targetDuration?: number;
}

export async function analyzeViralShorts(req: AnalyzeRequest) {
  const ai = getAiClient();
  const targetDuration = req.targetDuration || 30;
  const style = req.style || 'Storytelling Misteri';
  const nicheTopic = req.nicheTopic?.trim() || 'Fakta Menarik & Sains Populer';
  const youtubeUrl = req.youtubeUrl?.trim() || '';

  const targetSceneCount = Math.max(5, Math.min(8, Math.round(targetDuration / 5)));

  const systemInstruction = `Kamu adalah pakar viral video engineer YouTube Shorts dan TikTok level top 1% dunia.
Tugasmu adalah menganalisis struktur retensi video pendek, membongkar "Viral Anatomy", dan me-remake naskah baru yang 100% original, adiktif, dan memiliki potensi viral jutaan views.
Semua teks voiceover, narasi, on_screen_text, dan deskripsi SEO harus ditulis dalam BAHASA INDONESIA yang sangat natural, energetik, dan memikat (kecuali visual_prompt yang HARUS dalam Bahasa Inggris untuk prompt image generator 9:16).
Patuhi aturan "Seamless Loop": scene terakhir harus memiliki transisi kalimat yang bersambung mulus kembali ke scene pertama!`;

  const promptText = `Lakukan analisis viral dan remake video YouTube Shorts dengan spesifikasi berikut:
- URL Asli: ${youtubeUrl || 'Tidak disertakan (buat berdasarkan topik)'}
- Topik / Sudut Pandang Niche Baru: ${nicheTopic}
- Gaya Bahasa Narasi: ${style}
- Target Durasi Video: ${targetDuration} detik
- Target Jumlah Scene: tepat ${targetSceneCount} scene

Buatkan blueprint lengkap:
1. viral_anatomy:
   - viral_score: angka 1-100 (estimasi potensi viral)
   - hook_analysis: analisis psikologi hook 3 detik pertama
   - pacing_wpm: perkiraan kecepatan kata per menit (misal 150-180)
   - retention_secret: rahasia retensi tinggi dan trik seamless loop
   - emotional_trigger: pemicu emosi utama penonton
2. seo_package:
   - title_options: 3 opsi judul klik-tinggi dengan hashtag #shorts
   - description: deskripsi video SEO Bahasa Indonesia lengkap dengan timestamps dan tagar
   - tags: tepat 10 tag kata kunci relevan
   - best_upload_time: rekomendasi jam posting terbaik
3. scenes (array tepat ${targetSceneCount} adegan):
   - scene_number: 1 sampai ${targetSceneCount}
   - duration_sec: durasi per adegan dalam detik (sekitar 3.5 - 5.5 detik)
   - voiceover_text: narasi Bahasa Indonesia memikat yang pas untuk durasi tersebut
   - visual_prompt: prompt visual photorealistic dalam Bahasa Inggris khusus format vertical 9:16 (unreal engine 5, cinematic lighting, ultra-detailed)
   - camera_motion: salah satu dari ['zoom_in', 'zoom_out', 'pan_up', 'pan_right']
   - on_screen_text: 2 sampai 4 kata kapital berdaya pukulan tinggi untuk teks layar`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      viral_anatomy: {
        type: Type.OBJECT,
        properties: {
          viral_score: { type: Type.NUMBER },
          hook_analysis: { type: Type.STRING },
          pacing_wpm: { type: Type.NUMBER },
          retention_secret: { type: Type.STRING },
          emotional_trigger: { type: Type.STRING },
        },
        required: ['viral_score', 'hook_analysis', 'pacing_wpm', 'retention_secret', 'emotional_trigger'],
      },
      seo_package: {
        type: Type.OBJECT,
        properties: {
          title_options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          description: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          best_upload_time: { type: Type.STRING },
        },
        required: ['title_options', 'description', 'tags', 'best_upload_time'],
      },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            scene_number: { type: Type.INTEGER },
            duration_sec: { type: Type.NUMBER },
            voiceover_text: { type: Type.STRING },
            visual_prompt: { type: Type.STRING },
            camera_motion: {
              type: Type.STRING,
              description: 'Must be zoom_in, zoom_out, pan_up, or pan_right',
            },
            on_screen_text: { type: Type.STRING },
          },
          required: [
            'scene_number',
            'duration_sec',
            'voiceover_text',
            'visual_prompt',
            'camera_motion',
            'on_screen_text',
          ],
        },
      },
    },
    required: ['viral_anatomy', 'seo_package', 'scenes'],
  };

  // Attempt 1: If YouTube URL is valid and public, try fileData video URI
  if (youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be')) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            fileData: {
              fileUri: youtubeUrl,
              mimeType: 'video/mp4',
            },
          },
          {
            text: promptText,
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.warn('Direct YouTube fileData fetch failed or restricted, using intelligent prompt analysis fallback:', err);
    }
  }

  // Fallback: Model generates rich viral remake using gemini-2.5-flash or gemini-3.8-flash
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (secondErr) {
    console.warn('gemini-2.5-flash fallback failed, trying gemini-3.8-flash:', secondErr);
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  }

  throw new Error('Gagal menghasilkan analisis blueprint');
}

export async function generateVisualImage(prompt: string, sceneNumber: number): Promise<string> {
  const ai = getAiClient();
  const enhancedPrompt = `${prompt}, 9:16 vertical orientation, ultra photorealistic, 8k resolution, cinematic atmosphere, octane render, masterpiece, dramatic composition`;

  // Try Imagen 3 first
  try {
    const imagenResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: enhancedPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '9:16',
      },
    });

    const imageBytes = imagenResponse.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      return `data:image/jpeg;base64,${imageBytes}`;
    }
  } catch (err) {
    console.warn('Imagen 3 failed or unavailable, trying gemini-3.1-flash-lite-image:', err);
  }

  // Fallback to gemini-3.1-flash-lite-image
  try {
    const flashResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '9:16',
        },
      },
    });

    const parts = flashResponse.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        return `data:${mime};base64,${part.inlineData.data}`;
      }
    }
  } catch (flashErr) {
    console.warn('Flash lite image failed, server will notify client to use procedural visual fallback:', flashErr);
  }

  throw new Error('Model visual generation limit reached');
}

export async function generateVoiceoverAudio(text: string, voiceName: string = 'Kore'): Promise<{ audioBase64: string; mimeType: string }> {
  const ai = getAiClient();
  const validVoice = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Aoede', 'Zephyr'].includes(voiceName)
    ? voiceName
    : 'Kore';

  // Try gemini-3.8-flash-lite-tts or gemini-2.5-flash-preview-tts
  const ttsModels = ['gemini-3.8-flash-lite-tts', 'gemini-2.5-flash-preview-tts'];
  let lastError: unknown = null;

  for (const model of ttsModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: validVoice },
            },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.[0];
      const audioData = audioPart?.inlineData?.data;
      const mimeType = audioPart?.inlineData?.mimeType || 'audio/wav';

      if (audioData) {
        return {
          audioBase64: audioData,
          mimeType,
        };
      }
    } catch (err) {
      lastError = err;
      console.warn(`TTS attempt with model ${model} failed:`, err);
    }
  }

  throw lastError || new Error('Gagal men-generate voiceover audio');
}

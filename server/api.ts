import { Router, Request, Response } from 'express';
import { analyzeViralShorts, generateVisualImage, generateVoiceoverAudio } from './gemini';

export const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

apiRouter.post('/analyze-viral', async (req: Request, res: Response) => {
  try {
    const { youtubeUrl, nicheTopic, style, targetDuration } = req.body;
    const result = await analyzeViralShorts({
      youtubeUrl,
      nicheTopic,
      style,
      targetDuration: Number(targetDuration) || 30,
    });
    res.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menganalisis URL Shorts';
    console.error('API /analyze-viral error:', error);
    res.status(500).json({ success: false, error: message });
  }
});

apiRouter.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, sceneNumber } = req.body;
    if (!prompt) {
      res.status(400).json({ success: false, error: 'Prompt visual diperlukan' });
      return;
    }
    const imageUrl = await generateVisualImage(prompt, Number(sceneNumber) || 1);
    res.json({ success: true, imageUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal men-generate visual AI';
    console.error('API /generate-image error:', error);
    res.status(500).json({ success: false, error: message });
  }
});

apiRouter.post('/generate-tts', async (req: Request, res: Response) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      res.status(400).json({ success: false, error: 'Teks voiceover diperlukan' });
      return;
    }
    const audioResult = await generateVoiceoverAudio(text, voice);
    res.json({ success: true, ...audioResult });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal men-generate audio TTS';
    console.error('API /generate-tts error:', error);
    res.status(500).json({ success: false, error: message });
  }
});

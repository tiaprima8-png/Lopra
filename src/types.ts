export type CameraMotion = 'zoom_in' | 'zoom_out' | 'pan_up' | 'pan_right';

export type CaptionTheme = 'hormozi' | 'neon' | 'minimal';

export type SfxTransitionType = 'whoosh' | 'pop' | 'alternate' | 'none';

export interface Scene {
  scene_number: number;
  duration_sec: number;
  voiceover_text: string;
  visual_prompt: string;
  camera_motion: CameraMotion;
  on_screen_text: string;
  imageUrl?: string;
  audioBlobUrl?: string;
  audioBase64?: string;
  isGeneratingVisual?: boolean;
  isGeneratingAudio?: boolean;
}

export interface ViralAnatomy {
  viral_score: number;
  hook_analysis: string;
  pacing_wpm: number;
  retention_secret: string;
  emotional_trigger: string;
}

export interface SeoPackage {
  title_options: string[];
  description: string;
  tags: string[];
  best_upload_time: string;
}

export interface ProjectData {
  id: string;
  title: string;
  sourceUrl?: string;
  nicheTopic: string;
  languageStyle: string;
  targetDuration: number;
  createdAt: string;
  channelName: string;
  channelAvatar: string;
  viral_anatomy: ViralAnatomy;
  seo_package: SeoPackage;
  scenes: Scene[];
  selectedVoice: string;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  niche: string;
}

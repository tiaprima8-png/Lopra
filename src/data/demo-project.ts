import { ProjectData } from '../types';
import { generateProceduralVisual } from '../utils/procedural-visual';

export function getInitialDemoProject(): ProjectData {
  const scenes = [
    {
      scene_number: 1,
      duration_sec: 4.0,
      voiceover_text: "Di detik ini juga, ada sesuatu di luar angkasa yang sedang mendekati bumi tanpa kita sadari!",
      visual_prompt: "Cinematic vertical 9:16 macro shot of a mysterious cosmic anomaly approaching a glowing blue Earth, ultra photorealistic, unreal engine 5 render, deep space stars, volumetric lighting, 8k",
      camera_motion: 'zoom_in' as const,
      on_screen_text: "BAHAYA TERSEMBUNYI",
    },
    {
      scene_number: 2,
      duration_sec: 4.5,
      voiceover_text: "Teleskop James Webb baru saja menangkap sinyal misterius dari lubang hitam raksasa yang belum pernah terdokumentasikan.",
      visual_prompt: "Cinematic vertical 9:16 close up of James Webb Space Telescope optical golden hexagonal mirrors glowing against dark nebulae, cosmic dust clouds, hyper-detailed, neon cyan light reflections",
      camera_motion: 'pan_right' as const,
      on_screen_text: "SINYAL ANEH",
    },
    {
      scene_number: 3,
      duration_sec: 4.5,
      voiceover_text: "Para astronom terkejut karena frekuensinya berulang setiap sembilan detik tepat seperti detak jantung buatan.",
      visual_prompt: "Cinematic vertical 9:16 visualization of pulsating sonic gravitational waves ripping through dark purple galaxy spacetime fabric, intricate sci-fi data rings, ultra-high resolution",
      camera_motion: 'zoom_out' as const,
      on_screen_text: "DETAK JANTUNG?",
    },
    {
      scene_number: 4,
      duration_sec: 4.0,
      voiceover_text: "Sebagian meyakini ini fenomena magnetar langka, tapi perhitungan fisikanya justru bertolak belakang!",
      visual_prompt: "Cinematic vertical 9:16 shot of hyper-dense burning neutron star spinning with violent electric plasma jets erupting into space, orange and violet lightning, cinematic flare",
      camera_motion: 'pan_up' as const,
      on_screen_text: "HUKUM FISIKA JEBOL",
    },
    {
      scene_number: 5,
      duration_sec: 4.2,
      voiceover_text: "Apakah ini bukti peradaban tipe tiga? Tulis teori gilamu di komentar dan subscribe agar kamu tahu bahwa...",
      visual_prompt: "Cinematic vertical 9:16 view from inside a futuristic astronaut helmet reflecting a colossal ancient megastructure orbiting a black hole event horizon, epic cinematic mood, photorealistic",
      camera_motion: 'zoom_in' as const,
      on_screen_text: "PERADABAN ALIEN?",
    }
  ];

  // Assign instant visual data URLs
  const enrichedScenes = scenes.map((s, idx) => ({
    ...s,
    imageUrl: generateProceduralVisual(s.scene_number, "Misteri Kosmik Web", s.on_screen_text, idx)
  }));

  return {
    id: 'proj_demo_01',
    title: 'Sinyal Aneh Lubang Hitam James Webb',
    sourceUrl: 'https://youtube.com/shorts/demo123456',
    nicheTopic: 'Fakta Sains & Misteri Luar Angkasa',
    languageStyle: 'Storytelling Misteri',
    targetDuration: 30,
    createdAt: new Date().toISOString(),
    channelName: 'Sains & Semesta ID',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    selectedVoice: 'Kore',
    viral_anatomy: {
      viral_score: 96,
      hook_analysis: 'Detik 0-3: Pertanyaan dramatis "bahaya tersembunyi" + zoom in cepat ke bumi membuat retensi penonton melompat hingga 88%.',
      pacing_wpm: 168,
      retention_secret: 'Koneksi loop sempurna di scene terakhir ("agar kamu tahu bahwa...") yang secara psikologis memaksa audiens menonton ulang dari scene 1.',
      emotional_trigger: 'Kombinasi rasa takut eksistensial, penasaran tinggi, dan rasa kagum astronomi kosmik.'
    },
    seo_package: {
      title_options: [
        'SINYAL RAHASIA James Webb Yang Dirahasiakan NASA?! #shorts',
        'Bukan Lubang Hitam Biasa! Detak Misterius Luar Angkasa #shorts',
        '3 Detik Sebelum Sinyal Ini Sampai Ke Bumi... #shorts'
      ],
      description: `Penemuan terbaru teleskop luar angkasa James Webb merekam sinyal gravitasi aneh dengan interval 9 detik. Apakah ini bukti peradaban ekstraterestrial atau fenomena magnetar baru?

⏱️ TIMESTAMPS:
00:00 - Bahaya mendekati bumi
00:08 - Sinyal aneh James Webb
00:16 - Pola detak 9 detik
00:23 - Teori ilmuwan & Loop

#shorts #astronomi #luarangakasa #misteri #sains #faktamenarik #jameswebb #blackhole`,
      tags: [
        'shorts',
        'fakta sains',
        'james webb teleskop',
        'misteri luar angkasa',
        'sinyal alien',
        'astronomi indonesia',
        'black hole',
        'fakta unik',
        'alam semesta',
        'edukasi sains'
      ],
      best_upload_time: 'Rabu & Jumat pukul 18:30 - 20:15 WIB (Peak Engagement Gen-Z Indonesia)'
    },
    scenes: enrichedScenes
  };
}

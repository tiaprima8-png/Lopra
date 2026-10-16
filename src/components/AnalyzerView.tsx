import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
  Clock,
  MessageSquare,
  Wand2,
  TrendingUp,
  HelpCircle,
  Film,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { ProjectData } from '../types';

interface AnalyzerViewProps {
  onAnalyze: (params: {
    youtubeUrl: string;
    nicheTopic: string;
    style: string;
    targetDuration: number;
  }) => Promise<void>;
  isAnalyzing: boolean;
  currentProject: ProjectData;
  onNavigateToStoryboard: () => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  onAnalyze,
  isAnalyzing,
  currentProject,
  onNavigateToStoryboard,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [nicheTopic, setNicheTopic] = useState('');
  const [style, setStyle] = useState('Storytelling Misteri');
  const [targetDuration, setTargetDuration] = useState(30);
  const [copiedSample, setCopiedSample] = useState(false);

  const sampleTemplates = [
    {
      title: 'Misteri Luar Angkasa & Lubang Hitam',
      url: 'https://www.youtube.com/shorts/sample-space-mystery',
      niche: 'Fakta Sains & Misteri Kosmik Astronomi',
      style: 'Storytelling Misteri',
      duration: 30,
    },
    {
      title: 'Psikologi Manipulasi Gelap (Dark Psychology)',
      url: 'https://www.youtube.com/shorts/sample-psychology-secrets',
      niche: 'Trik Psikologi & Bahasa Tubuh Manusia',
      style: 'Fakta Mengejutkan (Mind-Blowing)',
      duration: 30,
    },
    {
      title: 'Rahasia Keuangan Kaum 1% Terkaya',
      url: 'https://www.youtube.com/shorts/sample-finance-wealth',
      niche: 'Finansial & Investasi Kaum Muda',
      style: 'Edukasi Cepat & Tajam',
      duration: 45,
    },
    {
      title: 'Kisah Sejarah Yang Dihapus Dari Buku Pelajaran',
      url: 'https://www.youtube.com/shorts/sample-hidden-history',
      niche: 'Fakta Sejarah Gelap & Konspirasi Dunia',
      style: 'Storytelling Misteri',
      duration: 60,
    },
  ];

  const handleApplySample = (sample: typeof sampleTemplates[0]) => {
    setYoutubeUrl(sample.url);
    setNicheTopic(sample.niche);
    setStyle(sample.style);
    setTargetDuration(sample.duration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      youtubeUrl,
      nicheTopic,
      style,
      targetDuration,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-violet-950/60 via-[#12121c]/90 to-cyan-950/40 border border-violet-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Reverse-Engineering YouTube Shorts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Ubah Video Viral Menjadi <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
              Konten 100% Original &amp; Siap Upload
            </span>
          </h1>
          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Masukkan link YouTube Shorts kompetitor atau topik baru Anda. Gemini 2.5 Flash akan membedah formula hook 3 detik, pacing retensi, dan otomatis meramu naskah remake lengkap beserta visual prompt 9:16 dan audio voiceover.
          </p>
        </div>
      </div>

      {/* Main Analyzer Form Card */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-[#121218]/90 border border-white/10 p-6 space-y-6 shadow-xl backdrop-blur-xl">
        {/* Step 1: URL Input */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-bold text-zinc-200">
            <span className="flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-violet-400" />
              URL YouTube Shorts Viral (Inspirasi Struktur)
            </span>
            <span className="text-[11px] text-zinc-500 font-normal">
              Contoh: youtube.com/shorts/...
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Tempelkan link YouTube Shorts viral di sini..."
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono"
            />
            {youtubeUrl && (
              <button
                type="button"
                onClick={() => setYoutubeUrl('')}
                className="absolute right-3 top-3 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Hapus
              </button>
            )}
          </div>
          <p className="text-[11px] text-zinc-500">
            *Jika tidak ada URL, sistem akan merancang naskah viral dari nol berdasarkan topik baru di bawah.
          </p>
        </div>

        {/* Step 2: Niche / New Topic Pivot */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-bold text-zinc-200">
            <span className="flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              Sudut Pandang / Topik Baru (Pivot Niche)
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              100% Originalitas Terjamin
            </span>
          </label>
          <input
            type="text"
            value={nicheTopic}
            onChange={(e) => setNicheTopic(e.target.value)}
            placeholder="Misal: Fakta Sains Luar Angkasa, Misteri Sejarah Kuno, atau Trik Finansial..."
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Step 3: Style & Duration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gaya Bahasa */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
              <MessageSquare className="w-4 h-4 text-violet-400" />
              Gaya Bahasa Naskah (Tone of Voice)
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
            >
              <option value="Storytelling Misteri">Storytelling Misteri &amp; Tegang</option>
              <option value="Edukasi Cepat & Tajam">Edukasi Cepat &amp; Tajam (High Pacing)</option>
              <option value="Fakta Mengejutkan (Mind-Blowing)">Fakta Mengejutkan (Mind-Blowing)</option>
              <option value="Santai / Gen-Z Slang">Santai / Gen-Z Casual Slang</option>
            </select>
          </div>

          {/* Target Durasi */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
              <Clock className="w-4 h-4 text-cyan-400" />
              Target Durasi Video
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((dur) => (
                <button
                  type="button"
                  key={dur}
                  onClick={() => setTargetDuration(dur)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    targetDuration === dur
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent shadow-md shadow-violet-500/20'
                      : 'bg-zinc-900/90 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-violet-600/30 flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Membedah Video &amp; Meremake Blueprint Naskah...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>Bedah &amp; Buat Blueprint Remake Viral</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Quick Start Templates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Contoh Niche Viral Populer (1-Klik Terapkan)
          </h3>
          <span className="text-[11px] text-zinc-500">Klik kartu untuk mencoba langsung</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleTemplates.map((template, idx) => (
            <div
              key={idx}
              onClick={() => handleApplySample(template)}
              className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-violet-500/40 hover:bg-zinc-900/90 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-zinc-200 group-hover:text-violet-300 transition-colors">
                  {template.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
                  {template.duration}s
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                {template.niche}
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                <span>Gaya: {template.style}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick jump to Storyboard if blueprint already loaded */}
      {currentProject.scenes.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">
                Blueprint Aktif: {currentProject.title} ({currentProject.scenes.length} Scene)
              </p>
              <p className="text-[11px] text-zinc-400">
                Siap untuk di-generate visual AI, disuarakan dengan TTS Gemini, atau diedit di storyboard.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToStoryboard}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Film className="w-4 h-4" />
            <span>Buka Storyboard Editor</span>
          </button>
        </div>
      )}
    </div>
  );
};

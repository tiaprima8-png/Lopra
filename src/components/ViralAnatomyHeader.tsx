import React from 'react';
import { Flame, Gauge, Zap, Repeat, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { ViralAnatomy } from '../types';

interface ViralAnatomyHeaderProps {
  anatomy: ViralAnatomy;
}

export const ViralAnatomyHeader: React.FC<ViralAnatomyHeaderProps> = ({ anatomy }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  return (
    <div className="rounded-2xl bg-[#121218]/90 border border-white/10 p-4 sm:p-5 shadow-xl relative overflow-hidden backdrop-blur-xl mb-6">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-violet-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-60 h-24 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center">
            <Flame className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              Viral Anatomy &amp; Retention Blueprint
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                AI RE-ENGINEERED
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Dianalisis menggunakan pembedahan retensi audio-visual Gemini Flash
            </p>
          </div>
        </div>

        {/* Viral Score Gauge Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
              Skor Potensi Viral
            </span>
            <span className="text-xs font-semibold text-emerald-400">Tinggi (Top 5% Niche)</span>
          </div>
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-2xl border font-black text-2xl font-mono shadow-inner ${getScoreColor(
              anatomy.viral_score
            )}`}
          >
            {anatomy.viral_score}
          </div>
        </div>
      </div>

      {/* 4-Column Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {/* Hook Breakdown */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Hook 0-3 Detik Pertama</span>
          </div>
          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
            {anatomy.hook_analysis}
          </p>
        </div>

        {/* Pacing Speed */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pacing Narasi (WPM)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-black text-white">
              {anatomy.pacing_wpm}
            </span>
            <span className="text-[11px] text-zinc-400">Kata per Menit</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Zona emas konsumsi YouTube Shorts (150 - 180 WPM)
          </p>
        </div>

        {/* Retention Loop Secret */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
            <Repeat className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rahasia Loop &amp; Retensi</span>
          </div>
          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
            {anatomy.retention_secret}
          </p>
        </div>

        {/* Emotional Trigger */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Pemicu Emosi Utama</span>
          </div>
          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
            {anatomy.emotional_trigger}
          </p>
        </div>
      </div>
    </div>
  );
};

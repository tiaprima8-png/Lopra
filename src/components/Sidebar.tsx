import React from 'react';
import {
  Compass,
  Film,
  Sparkles,
  Share2,
  Sliders,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Radio,
  Layers
} from 'lucide-react';
import { ProjectData } from '../types';

export type ActiveTab = 'analyze' | 'storyboard' | 'render' | 'publish';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  project: ProjectData;
  onOpenChannelModal: () => void;
  readyAssetsCount: number;
  totalScenes: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  project,
  onOpenChannelModal,
  readyAssetsCount,
  totalScenes
}) => {
  const steps = [
    {
      id: 'analyze' as ActiveTab,
      number: '1',
      title: 'Riset & Analisis Viral',
      subtitle: 'Bedah Hook & Struktur Loop',
      icon: Compass,
      badge: `${project.viral_anatomy.viral_score}% Viral`,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'storyboard' as ActiveTab,
      number: '2',
      title: 'Storyboard & Aset AI',
      subtitle: 'Visual 9:16 + TTS Gemini',
      icon: Film,
      badge: `${readyAssetsCount}/${totalScenes} Aset`,
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    },
    {
      id: 'render' as ActiveTab,
      number: '3',
      title: 'Studio Render 9:16',
      subtitle: 'Transisi SFX & Subtitle',
      icon: Sliders,
      badge: 'Interactive',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      id: 'publish' as ActiveTab,
      number: '4',
      title: 'Jadwal & Auto-Upload',
      subtitle: 'SEO Tag, Deskripsi & API',
      icon: Share2,
      badge: 'Ready',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0 border-r border-white/10 bg-[#0d0d12]/90 flex flex-col justify-between p-4 overflow-y-auto">
      <div className="space-y-5">
        {/* Active Channel Card */}
        <div
          onClick={onOpenChannelModal}
          className="group relative p-3 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-violet-500/40 transition-all cursor-pointer shadow-sm hover:shadow-violet-500/10"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={project.channelAvatar}
                alt={project.channelName}
                className="w-11 h-11 rounded-full object-cover border-2 border-violet-500"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-zinc-900 flex items-center justify-center">
                <Radio className="w-2 h-2 text-white" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate block">
                  {project.channelName}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Niche: {project.nicheTopic.split('&')[0]}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Target: 100k Views
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Navigation */}
        <div className="space-y-1.5">
          <div className="px-2 pb-1 flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Alur Produksi</span>
            <span className="text-zinc-600 font-mono">4 Langkah</span>
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`w-full text-left p-3 rounded-xl transition-all relative flex items-start gap-3 border ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/20 via-violet-500/10 to-transparent border-violet-500/40 text-white shadow-md shadow-violet-500/5'
                    : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/70'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isActive
                      ? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-sm'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {step.subtitle}
                  </p>
                  <div className="mt-1.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${step.badgeColor}`}
                    >
                      {step.badge}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <span className="w-1.5 h-6 bg-gradient-to-b from-violet-400 to-cyan-400 rounded-full absolute right-1 top-4" />
                )}
              </button>
            );
          })}
        </div>

        {/* Algorithm Quick Insights */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Rahasia Algoritma Shorts</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            YouTube Shorts memprioritaskan{' '}
            <strong className="text-zinc-200">APV (Average Percentage Viewed) &gt; 110%</strong>.
            Gunakan transisi audio <strong className="text-cyan-400">Whoosh/Pop</strong> untuk mencegah drop-off di detik ke-5.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Kuota AI Studio
          </span>
          <span className="font-semibold text-emerald-400">Unlimited Dev</span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full w-4/5 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
          <span>Engine: @google/genai</span>
          <span>Latency: ~800ms</span>
        </div>
      </div>
    </aside>
  );
};

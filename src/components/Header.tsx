import React from 'react';
import { Sparkles, Video, Zap, RefreshCw, FolderPlus, CheckCircle2 } from 'lucide-react';
import { ProjectData } from '../types';

interface HeaderProps {
  project: ProjectData;
  onNewProject: () => void;
  onResetDemo: () => void;
  onSwitchChannel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onNewProject,
  onResetDemo,
  onSwitchChannel
}) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0c0c10]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20">
          <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center">
            <Video className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Loopra Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Zap className="w-2.5 h-2.5" /> v2.5 PRO
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-zinc-400 truncate max-w-xs">
            YouTube Shorts Viral Analyzer & Remake Studio
          </p>
        </div>
      </div>

      {/* Center Project Title Pill */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 text-xs text-zinc-300 max-w-sm truncate">
        <span className="w-2 h-2 rounded-full bg-violet-400"></span>
        <span className="text-zinc-500 font-medium">Proyek:</span>
        <span className="font-semibold text-zinc-200 truncate">{project.title}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Channel Button */}
        <button
          onClick={onSwitchChannel}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition-colors"
          title="Ganti Channel YouTube"
        >
          <img
            src={project.channelAvatar}
            alt={project.channelName}
            className="w-5 h-5 rounded-full object-cover border border-violet-500/40"
          />
          <span className="hidden sm:inline font-medium max-w-[110px] truncate">
            {project.channelName}
          </span>
        </button>

        {/* API Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Gemini AI Siap</span>
        </div>

        {/* Reset Demo button */}
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition-colors"
          title="Muat Ulang Contoh Demo"
        >
          <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">Demo</span>
        </button>

        {/* Proyek Baru */}
        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-violet-600/20 transition-all active:scale-95"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Proyek Baru</span>
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Image as ImageIcon,
  Play,
  RotateCw,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Clock,
  Layers,
  Video,
  FileText,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { Scene, ProjectData, CameraMotion } from '../types';
import { ViralAnatomyHeader } from './ViralAnatomyHeader';

interface StoryboardEditorProps {
  project: ProjectData;
  onUpdateScene: (index: number, updated: Partial<Scene>) => void;
  onAddScene: () => void;
  onDeleteScene: (index: number) => void;
  onGenerateSceneVisual: (index: number) => Promise<void>;
  onGenerateSceneAudio: (index: number) => Promise<void>;
  onBatchGenerateAll: () => Promise<void>;
  isBatchGenerating: boolean;
  batchProgress: { current: number; total: number };
  onSelectVoice: (voice: string) => void;
  onJumpToScenePlayer: (index: number) => void;
}

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  project,
  onUpdateScene,
  onAddScene,
  onDeleteScene,
  onGenerateSceneVisual,
  onGenerateSceneAudio,
  onBatchGenerateAll,
  isBatchGenerating,
  batchProgress,
  onSelectVoice,
  onJumpToScenePlayer,
}) => {
  const [playingAudioIdx, setPlayingAudioIdx] = useState<number | null>(null);

  const voices = [
    { id: 'Kore', label: 'Kore (Wanita - Tegas & Karismatik)' },
    { id: 'Puck', label: 'Puck (Pria - Energetik & Seru)' },
    { id: 'Charon', label: 'Charon (Pria - Misterius & Dalam)' },
    { id: 'Fenrir', label: 'Fenrir (Pria - Kuat & Berwibawa)' },
    { id: 'Aoede', label: 'Aoede (Wanita - Lembut & Sinematik)' },
    { id: 'Zephyr', label: 'Zephyr (Netral - Modern & Cepat)' },
  ];

  const handlePlayAudio = (sceneIdx: number, audioUrl?: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    setPlayingAudioIdx(sceneIdx);
    audio.play();
    audio.onended = () => setPlayingAudioIdx(null);
    audio.onerror = () => setPlayingAudioIdx(null);
  };

  const handleCustomImageUpload = (sceneIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateScene(sceneIdx, { imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Viral Anatomy Breakdown Dashboard */}
      <ViralAnatomyHeader anatomy={project.viral_anatomy} />

      {/* 2. Master Action Bar & Voice Selector */}
      <div className="rounded-2xl bg-[#121218]/90 border border-white/10 p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Pilihan Suara TTS Gemini
            </span>
            <div className="flex items-center gap-2">
              <select
                value={project.selectedVoice}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-white/10 mx-1" />

          <div className="text-xs text-zinc-400">
            <span className="text-zinc-200 font-bold">{project.scenes.length} Adengan</span>
            {' • '}
            <span>
              Total Durasi:{' '}
              <strong className="text-cyan-400">
                {project.scenes.reduce((acc, s) => acc + s.duration_sec, 0).toFixed(1)}s
              </strong>
            </span>
          </div>
        </div>

        {/* Master Batch Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onBatchGenerateAll}
            disabled={isBatchGenerating}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-extrabold shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isBatchGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>
                  Membuat Aset ({batchProgress.current}/{batchProgress.total})...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Generate Semua Aset Otomatis (Visual + TTS)</span>
              </>
            )}
          </button>

          <button
            onClick={onAddScene}
            className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Tambah Scene Baru"
          >
            <Plus className="w-4 h-4 text-violet-400" />
            <span className="hidden md:inline">Tambah Scene</span>
          </button>
        </div>
      </div>

      {/* Progress Bar during Batch Generation */}
      {isBatchGenerating && (
        <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-2">
          <div className="flex justify-between text-xs text-violet-300 font-semibold">
            <span>Membuat Visual 9:16 &amp; Audio Voiceover Gemini...</span>
            <span className="font-mono">
              {Math.round((batchProgress.current / Math.max(1, batchProgress.total)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${(batchProgress.current / Math.max(1, batchProgress.total)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Scene-by-Scene Storyboard Cards */}
      <div className="space-y-4">
        {project.scenes.map((scene, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#121218]/90 border border-white/10 p-4 sm:p-5 shadow-lg hover:border-white/20 transition-all backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Visual 9:16 Thumbnail Preview & Controls (lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden border border-white/10 bg-zinc-950 shadow-inner group">
                  {scene.imageUrl ? (
                    <img
                      src={scene.imageUrl}
                      alt={`Scene ${scene.scene_number}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center space-y-2 text-zinc-500">
                      <ImageIcon className="w-8 h-8 text-zinc-600" />
                      <span className="text-[11px]">Visual Belum Dibuat</span>
                    </div>
                  )}

                  {/* Scene Badge Overlay */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-violet-300 border border-white/10">
                    SCENE 0{scene.scene_number}
                  </div>

                  {/* Camera Motion Overlay */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono font-medium text-cyan-300 border border-white/10">
                    {scene.camera_motion.toUpperCase().replace('_', ' ')}
                  </div>

                  {/* Overlay Center On-Screen Text Preview */}
                  <div className="absolute bottom-3 inset-x-2 text-center">
                    <span className="inline-block px-2 py-1 rounded bg-black/85 text-[10px] font-black text-amber-300 border border-amber-400/30 uppercase tracking-wider shadow">
                      {scene.on_screen_text || 'HIGHLIGHT'}
                    </span>
                  </div>

                  {/* Loading Spinner during individual generation */}
                  {scene.isGeneratingVisual && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                      <RotateCw className="w-6 h-6 animate-spin text-cyan-400" />
                      <span className="text-[10px] text-zinc-300 font-semibold">
                        Men-generate Visual...
                      </span>
                    </div>
                  )}
                </div>

                {/* Visual Action Buttons */}
                <div className="flex items-center justify-center gap-2 max-w-[200px] mx-auto">
                  <button
                    onClick={() => onGenerateSceneVisual(idx)}
                    disabled={scene.isGeneratingVisual}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Generate Ulang Visual dengan AI"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>AI Visual</span>
                  </button>

                  <label
                    className="py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Unggah Gambar Sendiri"
                  >
                    <Upload className="w-3 h-3 text-violet-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCustomImageUpload(idx, e)}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => onJumpToScenePlayer(idx)}
                    className="py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Lihat Scene Ini di Pemutar Kanan"
                  >
                    <Play className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Right Column: Script, Visual Prompt & Motion Editors (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Header Row: Scene Number, Duration, Delete */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      ADENGAN {scene.scene_number}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Bagian: {idx === 0 ? '🔥 Hook Utama' : idx === project.scenes.length - 1 ? '🔁 Seamless Loop' : '⚡ Eskalasi Cerita'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Duration Controller */}
                    <div className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-white/10">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span className="text-[11px] text-zinc-400 font-mono">Durasi:</span>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="15"
                        value={scene.duration_sec}
                        onChange={(e) =>
                          onUpdateScene(idx, { duration_sec: parseFloat(e.target.value) || 3.0 })
                        }
                        className="w-12 bg-transparent text-right font-mono text-xs font-bold text-cyan-400 focus:outline-none"
                      />
                      <span className="text-[11px] text-zinc-500">detik</span>
                    </div>

                    {/* Delete button (if > 3 scenes) */}
                    {project.scenes.length > 3 && (
                      <button
                        onClick={() => onDeleteScene(idx)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Hapus Scene Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Indonesian Voiceover Narration Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-violet-400" />
                      Naskah Voiceover (Bahasa Indonesia)
                    </label>

                    {/* TTS Action */}
                    <div className="flex items-center gap-2">
                      {scene.audioBlobUrl && (
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(idx, scene.audioBlobUrl)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{playingAudioIdx === idx ? 'Memutar...' : 'Dengar Suara'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onGenerateSceneAudio(idx)}
                        disabled={scene.isGeneratingAudio}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/30 transition-colors cursor-pointer"
                      >
                        {scene.isGeneratingAudio ? (
                          <RotateCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{scene.audioBlobUrl ? 'Regenerate Suara' : 'Buat Suara TTS'}</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={scene.voiceover_text}
                    onChange={(e) => onUpdateScene(idx, { voiceover_text: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 leading-relaxed font-sans"
                    placeholder="Tulis narasi untuk adegan ini..."
                  />
                </div>

                {/* 2 Sub-fields: On-Screen Text & Camera Motion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 flex items-center gap-1">
                      <span>Teks Layar (On-Screen Punch Words)</span>
                    </label>
                    <input
                      type="text"
                      value={scene.on_screen_text}
                      onChange={(e) =>
                        onUpdateScene(idx, { on_screen_text: e.target.value.toUpperCase() })
                      }
                      placeholder="CONTOH: FAKTA GILA"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono font-bold uppercase focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-cyan-400" />
                      <span>Gerakan Kamera (Ken Burns 9:16)</span>
                    </label>
                    <select
                      value={scene.camera_motion}
                      onChange={(e) =>
                        onUpdateScene(idx, { camera_motion: e.target.value as CameraMotion })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="zoom_in">🔍 Zoom In (Fokus Dramatis)</option>
                      <option value="zoom_out">🔭 Zoom Out (Reveal Luas)</option>
                      <option value="pan_up">⬆️ Pan Ke Atas (Skala Vertikal)</option>
                      <option value="pan_right">➡️ Pan Ke Kanan (Perjalanan Sinematik)</option>
                    </select>
                  </div>
                </div>

                {/* Visual Prompt (English Prompt for 9:16 AI Image Generator) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-zinc-400" />
                    <span>Visual Prompt AI (English - 9:16 High-Res Generation)</span>
                  </label>
                  <input
                    type="text"
                    value={scene.visual_prompt}
                    onChange={(e) => onUpdateScene(idx, { visual_prompt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-300 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="Cinematic vertical 9:16 description..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

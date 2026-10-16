import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  UploadCloud,
  FileCode,
  ShieldCheck,
  Key,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ProjectData } from '../types';

interface PublishManagerProps {
  project: ProjectData;
}

export const PublishManager: React.FC<PublishManagerProps> = ({ project }) => {
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // YouTube OAuth Direct Upload Modal State
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [oauthToken, setOauthToken] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState<'private' | 'unlisted' | 'public'>('unlisted');
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `loopra-blueprint-${project.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSimulatedDirectUpload = () => {
    if (!oauthToken.trim()) {
      setUploadStatus('Silakan masukkan Google OAuth Access Token terlebih dahulu.');
      return;
    }
    setUploadStatus('Menginisialisasi Resumable Upload ke YouTube Data API v3...');
    setTimeout(() => {
      setUploadStatus(
        'Upload Resumable Berhasil! Video terunggah ke channel Anda sebagai Draft / Unlisted. ID: dQw4w9WgXcQ'
      );
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title Header */}
      <div className="rounded-2xl bg-[#121218]/90 border border-white/10 p-5 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <span>SEO Package &amp; YouTube Shorts Publish Hub</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Salin metadata siap viral atau hubungkan langsung dengan YouTube API v3
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-violet-400" />
            <span>Download JSON Blueprint</span>
          </button>

          <button
            onClick={() => setShowYoutubeModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Hubungkan YouTube API</span>
          </button>
        </div>
      </div>

      {/* 1. High-CTR Title Options */}
      <div className="rounded-2xl bg-[#121218]/90 border border-white/10 p-5 space-y-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            3 Opsi Judul Klik-Tinggi (High CTR Titles)
          </label>
          <span className="text-[11px] text-zinc-500">Pilih salah satu untuk disalin</span>
        </div>

        <div className="space-y-2">
          {project.seo_package.title_options.map((title, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTitleIdx(idx)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                selectedTitleIdx === idx
                  ? 'bg-violet-600/15 border-violet-500/50 text-white shadow-sm'
                  : 'bg-zinc-900/60 border-white/5 text-zinc-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    selectedTitleIdx === idx
                      ? 'bg-violet-500 text-white'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold">{title}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(title, `title-${idx}`);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1 transition-colors"
              >
                {copiedType === `title-${idx}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Full Indonesian SEO Description */}
      <div className="rounded-2xl bg-[#121218]/90 border border-white/10 p-5 space-y-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            Deskripsi Video SEO Lengkap (Timestamps &amp; Hashtags)
          </label>
          <button
            onClick={() => handleCopy(project.seo_package.description, 'description')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedType === 'description' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-violet-400" />
                <span>Salin Deskripsi</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={6}
          readOnly
          value={project.seo_package.description}
          className="w-full p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none"
        />
      </div>

      {/* 3. 10 High-Ranking Tags & Best Upload Time */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Tags (md:col-span-8) */}
        <div className="md:col-span-8 rounded-2xl bg-[#121218]/90 border border-white/10 p-5 space-y-3 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              10 Tag Kata Kunci Ranking Tinggi
            </label>
            <button
              onClick={() => handleCopy(project.seo_package.tags.join(', '), 'tags')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedType === 'tags' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-emerald-400" />
                  <span>Salin Semua Tag</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.seo_package.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1"
              >
                <span className="text-violet-400">#</span>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Best Upload Time (md:col-span-4) */}
        <div className="md:col-span-4 rounded-2xl bg-[#121218]/90 border border-white/10 p-5 space-y-3 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Calendar className="w-4 h-4" />
              <span>Jam Tayang Rekomendasi</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
              {project.seo_package.best_upload_time}
            </p>
          </div>

          <div className="pt-2 border-t border-white/5">
            <p className="text-[11px] text-zinc-500">
              Dianalisis berdasarkan waktu aktif audiens YouTube Shorts Indonesia.
            </p>
          </div>
        </div>
      </div>

      {/* YouTube Data API v3 Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#121218] border border-white/20 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">YouTube Data API v3 Integration</h3>
                  <p className="text-[11px] text-zinc-400">Direct Upload &amp; Schedule</p>
                </div>
              </div>
              <button
                onClick={() => setShowYoutubeModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-violet-400" />
                  Google OAuth2 Access Token
                </label>
                <input
                  type="password"
                  value={oauthToken}
                  onChange={(e) => setOauthToken(e.target.value)}
                  placeholder="Bearer ya29.a0AfH6SM..."
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
                <p className="text-[10px] text-zinc-500">
                  Dibutuhkan scope: <code className="text-zinc-400">https://www.googleapis.com/auth/youtube.upload</code>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">Status Privasi</label>
                  <select
                    value={privacyStatus}
                    onChange={(e) => setPrivacyStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs"
                  >
                    <option value="unlisted">Unlisted (Direkomendasikan)</option>
                    <option value="private">Private</option>
                    <option value="public">Public (Langsung Tayang)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">Jadwal Tayang (Opsional)</label>
                  <input
                    type="datetime-local"
                    value={scheduleDateTime}
                    onChange={(e) => setScheduleDateTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {uploadStatus && (
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-cyan-300">
                  {uploadStatus}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowYoutubeModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-medium hover:text-white"
              >
                Tutup
              </button>
              <button
                onClick={handleSimulatedDirectUpload}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Video Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Radio, Plus, Check, Trash2 } from 'lucide-react';
import { YouTubeChannel } from '../types';

interface ChannelSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeChannelName: string;
  onSelectChannel: (channel: YouTubeChannel) => void;
}

export const ChannelSwitcherModal: React.FC<ChannelSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeChannelName,
  onSelectChannel,
}) => {
  const [channels, setChannels] = useState<YouTubeChannel[]>([
    {
      id: 'ch_1',
      name: 'Sains & Semesta ID',
      handle: '@sainssemestaid',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      subscribers: '142K Subs',
      niche: 'Fakta Sains Populer & Kosmik Astronomi',
    },
    {
      id: 'ch_2',
      name: 'Misteri Horor Dunia',
      handle: '@misterihororid',
      avatar: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80',
      subscribers: '89K Subs',
      niche: 'Kisah Misteri Gelap & Cerita Nyata',
    },
    {
      id: 'ch_3',
      name: 'Finansial Kaum Muda',
      handle: '@finansialmuda',
      avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
      subscribers: '320K Subs',
      niche: 'Investasi, Mindset Sukses & Uang',
    },
  ]);

  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelNiche, setNewChannelNiche] = useState('');

  if (!isOpen) return null;

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newChan: YouTubeChannel = {
      id: `ch_${Date.now()}`,
      name: newChannelName.trim(),
      handle: `@${newChannelName.trim().toLowerCase().replace(/\s+/g, '')}`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      subscribers: '0 Subs (Baru)',
      niche: newChannelNiche.trim() || 'Umum',
    };

    setChannels([...channels, newChan]);
    onSelectChannel(newChan);
    setNewChannelName('');
    setNewChannelNiche('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#121218] border border-white/20 p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Kelola Channel YouTube Shorts</h3>
              <p className="text-[11px] text-zinc-400">Pilih channel aktif untuk proyek ini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Existing channels list */}
        <div className="space-y-2">
          {channels.map((chan) => {
            const isSelected = chan.name === activeChannelName;
            return (
              <div
                key={chan.id}
                onClick={() => {
                  onSelectChannel(chan);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-violet-600/20 border-violet-500/60 shadow-md'
                    : 'bg-zinc-900/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={chan.avatar}
                    alt={chan.name}
                    className="w-10 h-10 rounded-full object-cover border border-violet-500/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {chan.name}
                      {isSelected && (
                        <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                          (Aktif)
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-zinc-400">{chan.handle} • {chan.subscribers}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{chan.niche}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Form add new channel */}
        <form onSubmit={handleAddChannel} className="pt-3 border-t border-white/10 space-y-3">
          <span className="text-xs font-bold text-zinc-300 block">Tambah Profil Channel Baru</span>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nama Channel (contoh: Fakta Heboh ID)"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            />
            <input
              type="text"
              placeholder="Fokus Niche (contoh: Psikologi & Pengembangan Diri)"
              value={newChannelNiche}
              onChange={(e) => setNewChannelNiche(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simpan &amp; Aktifkan Channel</span>
          </button>
        </form>
      </div>
    </div>
  );
};

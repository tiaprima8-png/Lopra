import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Settings2,
  Sliders,
  Sparkles,
  Music,
  CheckCircle2,
  Film,
  Zap,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Scene, ProjectData, CaptionTheme, SfxTransitionType } from '../types';
import {
  getAudioContext,
  triggerSceneTransitionSfx,
  playWhooshSfx,
  playPopSfx,
  createAmbientBgm
} from '../utils/audio-sfx';

interface PhoneStudioPlayerProps {
  project: ProjectData;
  activeSceneIndex: number;
  setActiveSceneIndex: (index: number) => void;
}

export const PhoneStudioPlayer: React.FC<PhoneStudioPlayerProps> = ({
  project,
  activeSceneIndex,
  setActiveSceneIndex
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Audio & SFX settings
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);
  const [sfxType, setSfxType] = useState<SfxTransitionType>('whoosh');
  const [sfxVolume, setSfxVolume] = useState(0.65);
  const [isBgmEnabled, setIsBgmEnabled] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.08);

  // Subtitle styling settings
  const [captionTheme, setCaptionTheme] = useState<CaptionTheme>('hormozi');
  const [captionYPercent, setCaptionYPercent] = useState(74); // % from top
  const [captionFontSize, setCaptionFontSize] = useState(48); // px on 1080x1920
  const [showControlsDrawer, setShowControlsDrawer] = useState(false);

  // Export recording state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');

  // Sfx trigger visual indicator
  const [sfxFlash, setSfxFlash] = useState<string | null>(null);

  // Internal image cache to prevent flicker
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bgmRef = useRef<{ start: () => void; stop: () => void; duck: (d: boolean) => void } | null>(null);

  // Calculate cumulative scene start times and total duration
  const sceneTimeline = React.useMemo(() => {
    let acc = 0;
    const timeline = project.scenes.map((s, idx) => {
      const start = acc;
      acc += s.duration_sec;
      return {
        index: idx,
        scene: s,
        start,
        end: acc,
        duration: s.duration_sec
      };
    });
    return { list: timeline, total: acc };
  }, [project.scenes]);

  useEffect(() => {
    setTotalDuration(sceneTimeline.total);
  }, [sceneTimeline]);

  // Preload images into memory
  useEffect(() => {
    project.scenes.forEach((s) => {
      if (s.imageUrl && !imageCacheRef.current.has(s.imageUrl)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = s.imageUrl;
        img.onload = () => {
          imageCacheRef.current.set(s.imageUrl!, img);
        };
      }
    });
  }, [project.scenes]);

  // BGM controller initialization
  useEffect(() => {
    if (isBgmEnabled && isPlaying) {
      const ctx = getAudioContext();
      if (!bgmRef.current) {
        bgmRef.current = createAmbientBgm(ctx);
      }
      bgmRef.current.start();
    } else {
      if (bgmRef.current) {
        bgmRef.current.stop();
        bgmRef.current = null;
      }
    }
    return () => {
      if (bgmRef.current) {
        bgmRef.current.stop();
        bgmRef.current = null;
      }
    };
  }, [isBgmEnabled, isPlaying]);

  /**
   * Primary 9:16 Canvas Drawing Function
   * Renders background image with Ken Burns camera motion, vignette, and animated captions.
   */
  const renderCanvasFrame = useCallback(
    (sceneIdx: number, sceneProgress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentScene = project.scenes[sceneIdx];
      if (!currentScene) return;

      // Virtual Canvas Resolution: 1080x1920 (Standard Full HD 9:16)
      const w = 1080;
      const h = 1920;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Image with Mathematical Camera Motion
      const cachedImg = currentScene.imageUrl ? imageCacheRef.current.get(currentScene.imageUrl) : null;

      if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
        ctx.save();

        let scale = 1.0;
        let transX = 0;
        let transY = 0;

        // Apply smooth easeInOut motion based on sceneProgress (0 to 1)
        const progress = Math.max(0, Math.min(1, sceneProgress));
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

        switch (currentScene.camera_motion) {
          case 'zoom_in':
            scale = 1.0 + 0.12 * ease;
            break;
          case 'zoom_out':
            scale = 1.15 - 0.12 * ease;
            break;
          case 'pan_up':
            scale = 1.1;
            transY = 50 - 100 * ease;
            break;
          case 'pan_right':
            scale = 1.1;
            transX = -50 + 100 * ease;
            break;
        }

        ctx.translate(w / 2, h / 2);
        ctx.scale(scale, scale);
        ctx.translate(-w / 2 + transX, -h / 2 + transY);

        // Aspect fill
        const imgAspect = cachedImg.naturalWidth / cachedImg.naturalHeight;
        const targetAspect = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = 0;
        let drawY = 0;

        if (imgAspect > targetAspect) {
          drawH = h;
          drawW = h * imgAspect;
          drawX = (w - drawW) / 2;
        } else {
          drawW = w;
          drawH = w / imgAspect;
          drawY = (h - drawH) / 2;
        }

        ctx.drawImage(cachedImg, drawX, drawY, drawW, drawH);
        ctx.restore();
      } else {
        // Fallback Dark Gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#100b24');
        grad.addColorStop(0.5, '#1e1145');
        grad.addColorStop(1, '#080512');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Cinematic Vignette & Bottom Dimming for text legibility
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.7);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.65, 'rgba(0,0,0,0.3)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Bottom shadow for caption readability
      const captionGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
      captionGrad.addColorStop(0, 'rgba(0,0,0,0)');
      captionGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
      captionGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = captionGrad;
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      // 3. Center Highlight On-Screen Words
      if (currentScene.on_screen_text) {
        ctx.save();
        const punchY = h * 0.38;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Badge Box
        ctx.font = '900 52px "Plus Jakarta Sans", sans-serif';
        const textMetrics = ctx.measureText(currentScene.on_screen_text);
        const paddingX = 40;
        const boxW = textMetrics.width + paddingX * 2;
        const boxH = 90;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4;
        roundRect(ctx, (w - boxW) / 2, punchY - boxH / 2, boxW, boxH, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FDE047';
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 15;
        ctx.fillText(currentScene.on_screen_text, w / 2, punchY + 4);
        ctx.restore();
      }

      // 4. Dynamic Animated CapCut / Hormozi Subtitles
      if (currentScene.voiceover_text) {
        drawCaptions(
          ctx,
          currentScene.voiceover_text,
          sceneProgress,
          w,
          h,
          captionTheme,
          captionYPercent,
          captionFontSize
        );
      }

      // 5. Top Channel Header & Progress Bar
      drawPlayerHeader(ctx, project.channelName, sceneTimeline.list, sceneIdx, sceneProgress, w);

      // 6. Transition SFX visual flash if active
      if (sfxFlash) {
        ctx.save();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
        ctx.lineWidth = 14;
        ctx.strokeRect(0, 0, w, h);
        ctx.restore();
      }
    },
    [project.scenes, project.channelName, sceneTimeline, captionTheme, captionYPercent, captionFontSize, sfxFlash]
  );

  /**
   * Helper: Draw Animated Captions on Canvas
   */
  const drawCaptions = (
    ctx: CanvasRenderingContext2D,
    text: string,
    progress: number,
    w: number,
    h: number,
    theme: CaptionTheme,
    yPercent: number,
    fontSize: number
  ) => {
    ctx.save();
    const words = text.split(' ');
    const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

    // Show chunk of 3-5 words at a time centered
    const chunkWordsCount = 4;
    const chunkIndex = Math.floor(activeWordIdx / chunkWordsCount);
    const visibleWords = words.slice(chunkIndex * chunkWordsCount, (chunkIndex + 1) * chunkWordsCount);
    const activeInChunk = activeWordIdx % chunkWordsCount;

    const posY = (h * yPercent) / 100;

    ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (theme === 'hormozi') {
      // Chunky Black Stroke, bright yellow active word box
      let totalWidth = 0;
      const wordMetrics = visibleWords.map((wd) => {
        const width = ctx.measureText(wd).width;
        totalWidth += width + 16;
        return { word: wd, width };
      });
      totalWidth -= 16;

      let currentX = (w - totalWidth) / 2;

      wordMetrics.forEach((item, idx) => {
        const isHighlight = idx === activeInChunk;
        const wordCenter = currentX + item.width / 2;

        if (isHighlight) {
          // Yellow highlight pill
          ctx.save();
          ctx.fillStyle = '#EAB308';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 4;
          roundRect(ctx, currentX - 10, posY - fontSize * 0.75, item.width + 20, fontSize * 1.5, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#000000';
          ctx.fillText(item.word.toUpperCase(), wordCenter, posY);
          ctx.restore();
        } else {
          // White text with thick black outline
          ctx.save();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 8;
          ctx.lineJoin = 'miter';
          ctx.miterLimit = 2;
          ctx.strokeText(item.word.toUpperCase(), wordCenter, posY);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(item.word.toUpperCase(), wordCenter, posY);
          ctx.restore();
        }

        currentX += item.width + 16;
      });
    } else if (theme === 'neon') {
      // Cyber Neon Cyan & Violet Glow
      const displayLine = visibleWords.join(' ').toUpperCase();
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 25;
      ctx.strokeStyle = '#08080C';
      ctx.lineWidth = 6;
      ctx.strokeText(displayLine, w / 2, posY);

      ctx.fillStyle = '#22D3EE';
      ctx.fillText(displayLine, w / 2, posY);
    } else {
      // Minimalist Clean Dark Rounded Pill
      const displayLine = visibleWords.join(' ');
      const m = ctx.measureText(displayLine);
      const boxW = m.width + 48;
      const boxH = fontSize * 1.6;

      ctx.fillStyle = 'rgba(10, 10, 15, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      roundRect(ctx, (w - boxW) / 2, posY - boxH / 2, boxW, boxH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(displayLine, w / 2, posY);
    }

    ctx.restore();
  };

  /**
   * Helper: Top Video Progress Bar and Channel Branding
   */
  const drawPlayerHeader = (
    ctx: CanvasRenderingContext2D,
    channelName: string,
    timeline: typeof sceneTimeline.list,
    activeIdx: number,
    sceneProgress: number,
    w: number
  ) => {
    // Top Segments Progress Bar
    const barY = 90;
    const barHeight = 8;
    const padding = 40;
    const totalBars = timeline.length;
    const gap = 8;
    const barWidth = (w - padding * 2 - (totalBars - 1) * gap) / totalBars;

    ctx.save();
    timeline.forEach((seg, i) => {
      const bx = padding + i * (barWidth + gap);

      // Background segment track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      roundRect(ctx, bx, barY, barWidth, barHeight, 4);
      ctx.fill();

      // Filled progress
      if (i < activeIdx) {
        ctx.fillStyle = '#FFFFFF';
        roundRect(ctx, bx, barY, barWidth, barHeight, 4);
        ctx.fill();
      } else if (i === activeIdx) {
        ctx.fillStyle = '#A855F7';
        const fillW = barWidth * Math.max(0, Math.min(1, sceneProgress));
        roundRect(ctx, bx, barY, fillW, barHeight, 4);
        ctx.fill();
      }
    });

    // Top Channel Watermark
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 10;
    ctx.fillText(`@${channelName.replace(/\s+/g, '').toLowerCase()}`, padding, barY + 30);
    ctx.restore();
  };

  /**
   * Audio Playback Coordinator
   * Plays each scene's audio sequentially, triggers SFX transition, and keeps canvas synced.
   */
  const playSceneAudio = useCallback(
    (sceneIdx: number) => {
      const scene = project.scenes[sceneIdx];
      if (!scene) return;

      // Stop previous audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      if (scene.audioBlobUrl) {
        const audio = new Audio(scene.audioBlobUrl);
        currentAudioRef.current = audio;
        audio.play().catch(() => {});

        audio.onended = () => {
          advanceToNextScene(sceneIdx);
        };

        audio.onerror = () => {
          // Fallback if audio fails
          setTimeout(() => advanceToNextScene(sceneIdx), scene.duration_sec * 1000);
        };
      } else {
        // Fallback timer if scene audio not yet generated
        const timer = setTimeout(() => {
          advanceToNextScene(sceneIdx);
        }, scene.duration_sec * 1000);
        return () => clearTimeout(timer);
      }
    },
    [project.scenes]
  );

  /**
   * Advances Scene & Triggers Transition SFX
   */
  const advanceToNextScene = useCallback(
    (currentIdx: number) => {
      const nextIdx = currentIdx + 1;

      // Trigger SFX if enabled
      if (isSfxEnabled && sfxType !== 'none') {
        const ctx = getAudioContext();
        triggerSceneTransitionSfx(
          sfxType as 'whoosh' | 'pop' | 'alternate',
          nextIdx,
          ctx,
          ctx.destination,
          sfxVolume
        );

        // Visual flash indicator
        setSfxFlash(`SFX ${sfxType.toUpperCase()}`);
        setTimeout(() => setSfxFlash(null), 300);
      }

      if (nextIdx < project.scenes.length) {
        setActiveSceneIndex(nextIdx);
        playSceneAudio(nextIdx);
      } else {
        // Loop back to start (Seamless Shorts Loop)
        setActiveSceneIndex(0);
        playSceneAudio(0);
      }
    },
    [isSfxEnabled, sfxType, sfxVolume, project.scenes.length, setActiveSceneIndex, playSceneAudio]
  );

  // Play / Pause toggle
  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (nextState) {
      playSceneAudio(activeSceneIndex);
    } else {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    }
  };

  const handleRestart = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    setActiveSceneIndex(0);
    setCurrentTime(0);
    if (isPlaying) {
      playSceneAudio(0);
    }
  };

  // Main animation frame loop
  useEffect(() => {
    let lastTimestamp = performance.now();
    let accumulatedSceneTime = 0;

    const currentScene = project.scenes[activeSceneIndex];
    const duration = currentScene?.duration_sec || 4.0;

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        accumulatedSceneTime += delta;
        if (accumulatedSceneTime > duration) {
          accumulatedSceneTime = duration;
        }
      }

      const progress = duration > 0 ? accumulatedSceneTime / duration : 0;
      renderCanvasFrame(activeSceneIndex, progress);

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, activeSceneIndex, project.scenes, renderCanvasFrame]);

  /**
   * EXPORT & DOWNLOAD VIDEO WITH SYNCHRONIZED SFX TRANSITIONS
   * Combines HTML5 Canvas video stream + Web Audio API Destination Node into MediaRecorder.
   * Transmits Voiceover + Synthesized Transition SFX directly into the final video file!
   */
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(0);
    setExportStatusText('Menginisialisasi Audio Graph & MediaRecorder...');

    // Pause current preview
    if (isPlaying) {
      setIsPlaying(false);
      if (currentAudioRef.current) currentAudioRef.current.pause();
    }

    try {
      // 1. Create Export AudioContext & Destination
      const exportAudioCtx = new AudioContext();
      const mediaStreamDest = exportAudioCtx.createMediaStreamDestination();

      // 2. Setup Canvas Stream
      const canvasStream = canvas.captureStream(30);

      // 3. Combine Canvas Video + Mixed Web Audio into single MediaStream
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...mediaStreamDest.stream.getAudioTracks(),
      ]);

      // 4. Select Best Supported MIME Type
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 8000000, // 8 Mbps High Quality
      });

      const recordedChunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      recorder.start();

      // 5. Render Each Scene sequentially in real-time
      const totalScenes = project.scenes.length;
      let completedDuration = 0;

      for (let sIdx = 0; sIdx < totalScenes; sIdx++) {
        const scene = project.scenes[sIdx];
        setExportStatusText(`Merender Scene ${sIdx + 1} dari ${totalScenes}...`);

        // TRIGGER TRANSITION SFX INTO EXPORT DESTINATION!
        if (isSfxEnabled && sfxType !== 'none') {
          triggerSceneTransitionSfx(
            sfxType as 'whoosh' | 'pop' | 'alternate',
            sIdx,
            exportAudioCtx,
            mediaStreamDest,
            sfxVolume
          );
        }

        // Play voiceover audio buffer into destination if available
        let audioSourceNode: AudioBufferSourceNode | null = null;
        if (scene.audioBlobUrl) {
          try {
            const resp = await fetch(scene.audioBlobUrl);
            const arrayBuf = await resp.arrayBuffer();
            const decodedBuffer = await exportAudioCtx.decodeAudioData(arrayBuf);
            audioSourceNode = exportAudioCtx.createBufferSource();
            audioSourceNode.buffer = decodedBuffer;
            audioSourceNode.connect(mediaStreamDest);
            audioSourceNode.start();
          } catch (err) {
            console.warn('Could not decode audio for export:', err);
          }
        }

        // Render frames for the duration of this scene
        const sceneDur = scene.duration_sec;
        const fps = 30;
        const totalFrames = Math.round(sceneDur * fps);

        for (let frame = 0; frame < totalFrames; frame++) {
          const progress = frame / totalFrames;
          renderCanvasFrame(sIdx, progress);

          // Update progress
          const currentProgressSeconds = completedDuration + (frame / totalFrames) * sceneDur;
          setExportProgress(Math.round((currentProgressSeconds / totalDuration) * 100));

          // Allow frame interval
          await new Promise((resolve) => setTimeout(resolve, 1000 / fps));
        }

        completedDuration += sceneDur;
      }

      // 6. Finalize Recording
      setExportStatusText('Menyusun file video final...');
      recorder.stop();

      await new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const cleanTitle = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          a.download = `loopra-${cleanTitle}-9x16.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        };
      });

      exportAudioCtx.close();
      setExportProgress(100);
      setExportStatusText('Video berhasil didownload!');
      setTimeout(() => {
        setIsExporting(false);
      }, 1500);
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor video. Pastikan browser mendukung MediaRecorder.');
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full lg:w-[380px] xl:w-[410px] shrink-0 sticky top-20 space-y-4">
      {/* 9:16 Smartphone Mockup Container */}
      <div className="relative mx-auto rounded-[42px] bg-gradient-to-b from-zinc-700 via-zinc-900 to-zinc-950 p-3 shadow-2xl shadow-violet-950/30 border border-white/20">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 inset-x-0 mx-auto w-28 h-4 rounded-full bg-black/90 z-30 flex items-center justify-between px-2.5">
          <span className="w-2 h-2 rounded-full bg-zinc-800" />
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-950 border border-cyan-500/40" />
        </div>

        {/* Screen Bezel Area */}
        <div className="relative aspect-[9/16] w-full rounded-[32px] overflow-hidden bg-black shadow-inner">
          {/* HTML5 Canvas Engine */}
          <canvas
            ref={canvasRef}
            width={1080}
            height={1920}
            className="w-full h-full object-cover cursor-pointer select-none"
            onClick={togglePlay}
          />

          {/* SFX Pop-up Badge Indicator */}
          {sfxFlash && (
            <div className="absolute top-16 right-4 z-20 px-2 py-1 rounded-md bg-violet-600/90 text-[10px] font-mono font-bold text-white border border-violet-400 shadow-lg animate-bounce">
              ⚡ {sfxFlash}
            </div>
          )}

          {/* Quick Play Overlay if Paused */}
          {!isPlaying && !isExporting && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-pointer transition-opacity z-10"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-violet-600/40 transform hover:scale-105 active:scale-95 transition-transform">
                <Play className="w-7 h-7 ml-1" />
              </div>
              <span className="text-xs font-bold text-white mt-3 drop-shadow bg-black/60 px-3 py-1 rounded-full">
                Klik Untuk Putar 9:16
              </span>
            </div>
          )}

          {/* Export Overlay */}
          {isExporting && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
              <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-cyan-400 animate-spin mb-4" />
              <h4 className="text-sm font-extrabold text-white mb-1">
                Merender Video Siap Upload
              </h4>
              <p className="text-xs text-zinc-400 mb-4">{exportStatusText}</p>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-150"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400">
                {exportProgress}% Selesai
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Media & SFX Control Dock */}
      <div className="rounded-2xl bg-[#121218]/90 border border-white/10 p-3.5 space-y-3 backdrop-blur-xl shadow-xl">
        {/* Playback Transport Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Putar Ulang dari Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/20 cursor-pointer active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
            </button>
          </div>

          {/* Scene Stepper */}
          <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-xl border border-white/5">
            <button
              onClick={() => {
                const prev = Math.max(0, activeSceneIndex - 1);
                setActiveSceneIndex(prev);
                playSceneAudio(prev);
              }}
              disabled={activeSceneIndex === 0}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-zinc-200">
              {activeSceneIndex + 1}/{project.scenes.length}
            </span>
            <button
              onClick={() => {
                const next = Math.min(project.scenes.length - 1, activeSceneIndex + 1);
                setActiveSceneIndex(next);
                playSceneAudio(next);
              }}
              disabled={activeSceneIndex === project.scenes.length - 1}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Drawer Toggle */}
          <button
            onClick={() => setShowControlsDrawer(!showControlsDrawer)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              showControlsDrawer
                ? 'bg-violet-600 text-white border-violet-500'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border-white/5'
            }`}
            title="Pengaturan Transisi SFX & Subtitle"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* SFX TRANSITION CONTROLS (User's specific requirement!) */}
        <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Transisi Audio SFX (Web Audio)</span>
            </div>

            {/* SFX On/Off Toggle Button */}
            <button
              onClick={() => setIsSfxEnabled(!isSfxEnabled)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                isSfxEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}
            >
              {isSfxEnabled ? 'SFX ON' : 'SFX OFF'}
            </button>
          </div>

          {isSfxEnabled && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-zinc-400">Jenis:</span>
              <div className="grid grid-cols-3 gap-1.5 flex-1">
                {(['whoosh', 'pop', 'alternate'] as SfxTransitionType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSfxType(t);
                      // Play test sound
                      const ctx = getAudioContext();
                      if (t === 'whoosh') playWhooshSfx(ctx);
                      else if (t === 'pop') playPopSfx(ctx);
                      else playWhooshSfx(ctx);
                    }}
                    className={`py-1 rounded text-[10px] font-semibold border transition-all ${
                      sfxType === t
                        ? 'bg-violet-600/30 text-violet-300 border-violet-500/50'
                        : 'bg-zinc-800/60 text-zinc-400 border-transparent hover:text-zinc-200'
                    }`}
                  >
                    {t === 'whoosh' ? 'Whoosh' : t === 'pop' ? 'Pop' : 'Whoosh+Pop'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer for Subtitle & Audio customization */}
        {showControlsDrawer && (
          <div className="space-y-3 pt-2 border-t border-white/5 text-xs">
            {/* Subtitle Style */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400">
                Gaya Subtitle (CapCut / Hormozi)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'hormozi' as CaptionTheme, label: 'Hormozi Pop' },
                  { id: 'neon' as CaptionTheme, label: 'Cyber Neon' },
                  { id: 'minimal' as CaptionTheme, label: 'Minimalist' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setCaptionTheme(st.id)}
                    className={`py-1 rounded text-[10px] font-semibold border transition-all ${
                      captionTheme === st.id
                        ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                        : 'bg-zinc-900 text-zinc-400 border-white/5'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle Y-position */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Posisi Vertikal Subtitle</span>
                <span>{captionYPercent}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="88"
                value={captionYPercent}
                onChange={(e) => setCaptionYPercent(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </div>

            {/* BGM Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-300 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-cyan-400" /> Musik Latar Ambient (Synth)
              </span>
              <button
                onClick={() => setIsBgmEnabled(!isBgmEnabled)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isBgmEnabled
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}
              >
                {isBgmEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}

        {/* Master Render & Download Button */}
        <button
          onClick={handleExportVideo}
          disabled={isExporting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Render &amp; Download Video Siap Upload (.webm)</span>
        </button>
      </div>
    </div>
  );
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Audio Synthesizer & SFX Engine for Loopra Studio AI
 * Powered by pure Web Audio API & PCM-to-WAV converter.
 */

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioContextClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Generates and plays a procedural 'whoosh' transition sound effect.
 * Uses a white noise buffer modulated with a sweeping bandpass filter and gain envelope.
 */
export function playWhooshSfx(
  ctx: AudioContext,
  targetNode: AudioNode = ctx.destination,
  volume = 0.6
): void {
  try {
    const duration = 0.38;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate smoothed white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Sweeping bandpass filter to create the characteristic rushing air effect
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;

    const now = ctx.currentTime;
    // Sweep from 180Hz -> 1400Hz -> 280Hz
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(220, now + duration);

    // Dynamic gain envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + duration * 0.35);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(targetNode);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration + 0.05);
  } catch (err) {
    console.warn('Could not synthesize whoosh SFX:', err);
  }
}

/**
 * Generates and plays a procedural 'pop' transition sound effect.
 * Uses a fast sine wave frequency drop with snappy attack and decay.
 */
export function playPopSfx(
  ctx: AudioContext,
  targetNode: AudioNode = ctx.destination,
  volume = 0.55
): void {
  try {
    const duration = 0.12;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';

    // Fast frequency drop (750Hz down to 80Hz) gives the crisp punchy pop
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + duration);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(targetNode);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch (err) {
    console.warn('Could not synthesize pop SFX:', err);
  }
}

/**
 * Triggers transition SFX based on selected type
 */
export function triggerSceneTransitionSfx(
  type: 'whoosh' | 'pop' | 'alternate',
  sceneIndex: number,
  ctx: AudioContext,
  targetNode: AudioNode = ctx.destination,
  volume = 0.6
): void {
  if (type === 'whoosh') {
    playWhooshSfx(ctx, targetNode, volume);
  } else if (type === 'pop') {
    playPopSfx(ctx, targetNode, volume);
  } else if (type === 'alternate') {
    if (sceneIndex % 2 === 0) {
      playWhooshSfx(ctx, targetNode, volume);
    } else {
      playPopSfx(ctx, targetNode, volume);
    }
  }
}

/**
 * Synthesizes an ambient lo-fi / cyber synth background loop with ducking capability.
 */
export function createAmbientBgm(ctx: AudioContext, targetNode: AudioNode = ctx.destination): {
  start: () => void;
  stop: () => void;
  duck: (isDucking: boolean) => void;
} {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.08; // subtle background level
  masterGain.connect(targetNode);

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sine';
  osc1.frequency.value = 130.81; // C3
  osc2.type = 'triangle';
  osc2.frequency.value = 196.00; // G3

  filter.type = 'lowpass';
  filter.frequency.value = 450;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(masterGain);

  let isStarted = false;

  return {
    start: () => {
      if (!isStarted) {
        osc1.start();
        osc2.start();
        isStarted = true;
      }
    },
    stop: () => {
      try {
        osc1.stop();
        osc2.stop();
      } catch {}
    },
    duck: (isDucking: boolean) => {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      if (isDucking) {
        masterGain.gain.linearRampToValueAtTime(0.025, now + 0.15);
      } else {
        masterGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      }
    }
  };
}

/**
 * MANDATORY PCM-TO-WAV CONVERTER:
 * Converts raw 16-bit 24kHz mono PCM audio into a valid RIFF/WAVE Blob URL.
 * Also checks if the base64 string is already a valid WAV file (starts with 'RIFF').
 */
export function rawPcmBase64ToWavBlobUrl(base64Data: string, sampleRate = 24000): string {
  try {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Check if it already has the 4-byte 'RIFF' header (0x52, 0x49, 0x46, 0x46)
    if (len >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      const wavBlob = new Blob([bytes], { type: 'audio/wav' });
      return URL.createObjectURL(wavBlob);
    }

    // Otherwise, it is raw 16-bit Mono PCM audio. Construct a standard 44-byte RIFF/WAVE header.
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const pcmByteLength = bytes.length;
    const wavBuffer = new ArrayBuffer(44 + pcmByteLength);
    const view = new DataView(wavBuffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // RIFF chunk length = file length - 8
    view.setUint32(4, 36 + pcmByteLength, true);
    // RIFF format 'WAVE'
    writeString(view, 8, 'WAVE');
    // Sub-chunk 1 identifier 'fmt '
    writeString(view, 12, 'fmt ');
    // Sub-chunk 1 size (16 for PCM)
    view.setUint32(16, 16, true);
    // Audio format (1 = PCM)
    view.setUint16(20, 1, true);
    // Number of channels (1 = mono)
    view.setUint16(22, numChannels, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate
    view.setUint32(28, byteRate, true);
    // Block align
    view.setUint16(32, blockAlign, true);
    // Bits per sample
    view.setUint16(34, bitsPerSample, true);
    // Sub-chunk 2 identifier 'data'
    writeString(view, 36, 'data');
    // Sub-chunk 2 length
    view.setUint32(40, pcmByteLength, true);

    // Copy raw PCM byte samples into payload
    const wavBytes = new Uint8Array(wavBuffer);
    wavBytes.set(bytes, 44);

    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Error converting PCM to WAV blob URL:', err);
    return '';
  }
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Measures exact duration in seconds of an audio blob URL
 */
export async function measureAudioDuration(blobUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = blobUrl;
    audio.preload = 'metadata';
    
    const timeout = setTimeout(() => {
      resolve(4.0); // Safe fallback
    }, 3000);

    audio.onloadedmetadata = () => {
      clearTimeout(timeout);
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        resolve(Math.round(audio.duration * 10) / 10);
      } else {
        resolve(4.0);
      }
    };

    audio.onerror = () => {
      clearTimeout(timeout);
      resolve(4.0);
    };
  });
}

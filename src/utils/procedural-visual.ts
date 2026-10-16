/**
 * Procedural 9:16 High-Res Visual Generator (1080x1920)
 * Provides cinematic visual canvas fallbacks with dramatic lighting,
 * gradients, typography badges, and grid lines.
 */

export function generateProceduralVisual(
  sceneNumber: number,
  title: string,
  onScreenText: string,
  visualThemeIndex: number = 0
): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const palettes = [
    { bg1: '#090A0F', bg2: '#131127', bg3: '#3B0764', accent: '#A855F7', secondary: '#EC4899', name: 'Cosmic Nebula' },
    { bg1: '#050B14', bg2: '#082F49', bg3: '#0E7490', accent: '#06B6D4', secondary: '#3B82F6', name: 'Cyber Depths' },
    { bg1: '#0F0B05', bg2: '#2A1805', bg3: '#78350F', accent: '#F59E0B', secondary: '#EF4444', name: 'Solar Flare' },
    { bg1: '#04130D', bg2: '#064E3B', bg3: '#065F46', accent: '#10B981', secondary: '#14B8A6', name: 'Bio Matrix' },
    { bg1: '#110515', bg2: '#3B0764', bg3: '#6B21A8', accent: '#C084FC', secondary: '#F43F5E', name: 'Hyper Void' }
  ];

  const theme = palettes[visualThemeIndex % palettes.length];

  // 1. Deep cinematic gradient background
  const grad = ctx.createRadialGradient(540, 700, 100, 540, 960, 1100);
  grad.addColorStop(0, theme.bg3);
  grad.addColorStop(0.5, theme.bg2);
  grad.addColorStop(1, theme.bg1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  // 2. Subtle glowing orbs & lights
  ctx.save();
  ctx.globalAlpha = 0.45;
  const glow1 = ctx.createRadialGradient(280, 500, 20, 280, 500, 450);
  glow1.addColorStop(0, theme.accent);
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(280, 500, 450, 0, Math.PI * 2);
  ctx.fill();

  const glow2 = ctx.createRadialGradient(800, 1200, 40, 800, 1200, 550);
  glow2.addColorStop(0, theme.secondary);
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.beginPath();
  ctx.arc(800, 1200, 550, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Futuristic Grid lines / Perspective Lines
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 2;
  const gridStep = 80;
  for (let x = 0; x <= 1080; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1920);
    ctx.stroke();
  }
  for (let y = 0; y <= 1920; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1080, y);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Subtle particles / stars
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 90; i++) {
    const px = (Math.sin(i * 123.45 + sceneNumber) * 0.5 + 0.5) * 1080;
    const py = (Math.cos(i * 456.78 + sceneNumber) * 0.5 + 0.5) * 1920;
    const pSize = (i % 3) + 1.5;
    ctx.globalAlpha = (i % 5 + 3) / 10;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 5. Stylized Center Emblem / Graphic Frame
  ctx.save();
  ctx.translate(540, 820);
  ctx.rotate((sceneNumber * 15 * Math.PI) / 180);

  // Outer glowing ring
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 4;
  ctx.shadowColor = theme.accent;
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(0, 0, 260, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring dashed
  ctx.strokeStyle = theme.secondary;
  ctx.setLineDash([16, 20]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 6. Top Scene Indicator Badge
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  const badgeWidth = 320;
  const badgeHeight = 64;
  const bx = (1080 - badgeWidth) / 2;
  const by = 260;
  roundRect(ctx, bx, by, badgeWidth, badgeHeight, 32);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = theme.accent;
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`SCENE 0${sceneNumber} // 9:16 AI`, 540, by + badgeHeight / 2);
  ctx.restore();

  // 7. Center Focus Visual Card / On-Screen Text
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 35;
  ctx.fillStyle = 'rgba(10, 10, 15, 0.75)';
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 3;
  const cardW = 860;
  const cardH = 240;
  const cx = (1080 - cardW) / 2;
  const cy = 700;
  roundRect(ctx, cx, cy, cardW, cardH, 24);
  ctx.fill();
  ctx.stroke();

  // On Screen Highlight Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 68px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = theme.accent;
  ctx.shadowBlur = 20;
  ctx.fillText(onScreenText || `SCENE ${sceneNumber}`, 540, cy + 90);

  // Subtitle/Context
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.shadowBlur = 0;
  const shortTitle = title.length > 40 ? title.substring(0, 38) + '...' : title;
  ctx.fillText(shortTitle, 540, cy + 165);
  ctx.restore();

  // 8. Cinematic Vignette
  const vignette = ctx.createRadialGradient(540, 960, 400, 540, 960, 1000);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(0.7, 'rgba(0,0,0,0.4)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 1080, 1920);

  return canvas.toDataURL('image/jpeg', 0.9);
}

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

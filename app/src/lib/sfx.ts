
function beep(freq = 440, ms = 90, vol = 0.08) {
  try {
    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close().catch(() => { });
    }, ms);
  } catch { }
}

async function playFile(path: string, fallbackFreq: number) {
  try {
    const a = new Audio(path);
    a.volume = 0.35;
    // Only play if file loads successfully
    await new Promise<void>((resolve, reject) => {
      a.oncanplaythrough = () => resolve();
      a.onerror = () => reject(new Error('Audio not found'));
      a.load();
    });
    await a.play();
  } catch {
    // Silent fallback - use beep only if audio context is available
    try { beep(fallbackFreq); } catch { /* completely silent */ }
  }
}

export const sfx = {
  click: () => playFile('sounds/click.mp3', 520),
  legendary: () => playFile('sounds/legendary.mp3', 780),
  cursed: () => playFile('sounds/cursed.mp3', 180),
  chaos: () => playFile('sounds/chaos.mp3', 100),
  whoosh: () => playFile('sounds/whoosh.mp3', 400),
};

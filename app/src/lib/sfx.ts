
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
  click: () => { try { beep(520); } catch { } },
  legendary: () => { try { beep(780, 400, 0.1); } catch { } },
  cursed: () => { try { beep(180, 600, 0.15); } catch { } },
  chaos: () => { try { beep(100, 800, 0.2); } catch { } },
  whoosh: () => { try { beep(400, 200, 0.05); } catch { } },
};

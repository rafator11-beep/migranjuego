
export function vibe(pattern: number | number[] = 40) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // @ts-ignore
      navigator.vibrate(pattern);
    }
  } catch {}
}

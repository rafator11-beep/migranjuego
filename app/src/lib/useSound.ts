
export function playClick() {
  const audio = new Audio('/sounds/click.mp3');
  audio.volume = 0.3;
  audio.play().catch(()=>{});
}

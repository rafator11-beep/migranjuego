import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function shuffleWithMemory<T>(array: T[], lastItems: T[] = [], memorySize = 10): T[] {
  const filtered = array.filter(item => !lastItems.includes(item));
  const arr = shuffleArray(filtered);
  return [...lastItems.slice(-memorySize), ...arr];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  // Double-pass Fisher-Yates for stronger randomization
  for (let pass = 0; pass < 2; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  return shuffled;
}

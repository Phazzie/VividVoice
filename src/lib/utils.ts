import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCharacterColor(characterName: string): string {
  if (characterName.toLowerCase() === 'narrator') {
    return 'hsl(var(--muted-foreground))';
  }
  let hash = 0;
  for (let i = 0; i < characterName.length; i++) {
    hash = characterName.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // Convert to 32bit integer
  }
  // Use a fixed saturation and lightness for color consistency
  const hue = Math.abs(hash % 360);
  const saturation = 70;
  const lightness = 40;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

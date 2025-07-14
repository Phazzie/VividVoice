import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCharacterColor(characterName: string): string {
  if (characterName.toLowerCase() === 'narrator') {
    // A cool, ethereal blue/cyan for the narrator
    return 'hsl(190, 80%, 70%)';
  }
  let hash = 0;
  for (let i = 0; i < characterName.length; i++) {
    hash = characterName.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // Convert to 32bit integer
  }

  const hue = Math.abs(hash % 360);
  // Using high saturation and lightness for vibrant, almost neon pastel colors
  const saturation = 90; 
  const lightness = 75;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

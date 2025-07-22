export const chunkText = (text: string, chunkSize: number): string[] => {
  const chunks: string[] = [];
  let currentChunk = "";
  const words = text.split(/\b/); // Split text at word boundaries

  for (const word of words) {
    if ((currentChunk + word).length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

export const chunkTextByParagraph = (text: string): string[] => {
  return text.split('\n\n');
};

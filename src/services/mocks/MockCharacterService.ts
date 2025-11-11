/**
 * Mock Character Service Implementation
 * Used for testing and development
 */

import type {
  ICharacterService,
  CharacterPortrait,
  Character,
  ChatMessage,
} from '../contracts';

export class MockCharacterService implements ICharacterService {
  async generatePortraits(
    characters: Character[]
  ): Promise<CharacterPortrait[]> {
    if (!characters || characters.length === 0) {
      return [];
    }

    // Generate mock portrait data URIs (1x1 transparent pixel)
    const mockImageDataUri =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    return characters
      .filter((char) => char.name.toLowerCase() !== 'narrator')
      .map((character) => ({
        name: character.name,
        portraitDataUri: mockImageDataUri,
      }));
  }

  async chatWithCharacter(
    character: Character,
    messages: ChatMessage[]
  ): Promise<ChatMessage> {
    if (!character || !messages || messages.length === 0) {
      throw new Error('Character and messages are required');
    }

    const lastMessage = messages[messages.length - 1];

    // Generate a mock response
    return {
      role: 'assistant',
      content: `Mock response from ${character.name}: I understand you said "${lastMessage.content}". This is a test response.`,
    };
  }
}

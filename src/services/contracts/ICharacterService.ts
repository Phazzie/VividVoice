/**
 * Character Service Contract
 * Defines the interface for character-related operations
 */

import type { Character, ChatMessage } from './types';

export interface CharacterPortrait {
  name: string;
  portraitDataUri: string;
}

/**
 * Character management service interface
 */
export interface ICharacterService {
  /**
   * Generate portraits for characters
   */
  generatePortraits(characters: Character[]): Promise<CharacterPortrait[]>;

  /**
   * Chat with a character in their persona
   */
  chatWithCharacter(
    character: Character,
    messages: ChatMessage[]
  ): Promise<ChatMessage>;

  /**
   * Get character response in the context of a story
   */
  getCharacterResponse(
    character: Character,
    history: ChatMessage[],
    userMessage: string,
    storyText: string
  ): Promise<string>;
}

/**
 * Real Character Service Implementation
 * Wraps existing character functionality for production use
 */

import type {
  ICharacterService,
  CharacterPortrait,
  Character,
  ChatMessage,
} from '../contracts';

import { generateCharacterPortraits as generateCharacterPortraitsFlow } from '@/ai/flows/generate-character-portraits';
import { characterChat as characterChatFlow } from '@/ai/flows/character-chat';

export class RealCharacterService implements ICharacterService {
  async generatePortraits(
    characters: Character[]
  ): Promise<CharacterPortrait[]> {
    console.log('RealCharacterService: Generating character portraits...');

    if (!characters || characters.length === 0) {
      return [];
    }

    try {
      const portraits = await generateCharacterPortraitsFlow({ characters });

      console.log('RealCharacterService: Portrait generation successful.');
      return portraits;
    } catch (error) {
      console.error(
        'RealCharacterService: Error during generatePortraits:',
        error
      );
      // Portrait generation is non-critical, return empty array
      return [];
    }
  }

  async chatWithCharacter(
    character: Character,
    messages: ChatMessage[]
  ): Promise<ChatMessage> {
    console.log('RealCharacterService: Chatting with character...');

    if (!character || !messages || messages.length === 0) {
      throw new Error('Character and messages are required');
    }

    try {
      const result = await characterChatFlow({ character, messages });

      console.log('RealCharacterService: Character chat successful.');
      return result;
    } catch (error) {
      console.error(
        'RealCharacterService: Error during chatWithCharacter:',
        error
      );
      throw new Error('Failed to chat with character.');
    }
  }
}

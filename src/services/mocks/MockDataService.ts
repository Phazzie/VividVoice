/**
 * Mock Data Service Implementation
 * Used for testing and development
 */

import type {
  IDataService,
  Story,
  SaveStoryInput,
} from '../contracts';

export class MockDataService implements IDataService {
  private stories: Map<string, Story> = new Map();
  private nextId = 1;

  async saveStory(storyData: SaveStoryInput): Promise<string> {
    const { id, userId, title, storyText } = storyData;

    if (!userId || !title || !storyText) {
      throw new Error('User ID, title, and story text are required');
    }

    if (id && this.stories.has(id)) {
      // Update existing story
      const existingStory = this.stories.get(id)!;
      const updatedStory: Story = {
        ...existingStory,
        title,
        storyText,
        updatedAt: new Date().toISOString(),
      };
      this.stories.set(id, updatedStory);
      return id;
    } else {
      // Create new story
      const newId = `story-${this.nextId++}`;
      const now = new Date().toISOString();
      const newStory: Story = {
        id: newId,
        userId,
        title,
        storyText,
        createdAt: now,
        updatedAt: now,
      };
      this.stories.set(newId, newStory);
      return newId;
    }
  }

  async getStoriesForUser(userId: string): Promise<Story[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return Array.from(this.stories.values()).filter(
      (story) => story.userId === userId
    );
  }

  async getStoryById(storyId: string): Promise<Story | null> {
    if (!storyId) {
      throw new Error('Story ID is required');
    }

    return this.stories.get(storyId) || null;
  }

  // Test utility methods
  clear(): void {
    this.stories.clear();
    this.nextId = 1;
  }

  seed(stories: Story[]): void {
    stories.forEach((story) => {
      this.stories.set(story.id, story);
    });
  }
}

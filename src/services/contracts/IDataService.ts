/**
 * Data Service Contract
 * Defines the interface for data persistence operations
 */

export interface Story {
  id: string;
  userId: string;
  title: string;
  storyText: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveStoryInput {
  id?: string;
  userId: string;
  title: string;
  storyText: string;
}

/**
 * Data persistence service interface
 */
export interface IDataService {
  /**
   * Save a story (create or update)
   */
  saveStory(storyData: SaveStoryInput): Promise<string>;

  /**
   * Get all stories for a user
   */
  getStoriesForUser(userId: string): Promise<Story[]>;

  /**
   * Get a single story by ID
   */
  getStoryById(storyId: string): Promise<Story | null>;
}

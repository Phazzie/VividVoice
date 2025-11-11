/**
 * Real Data Service Implementation
 * Wraps Firebase Firestore operations for production use
 */

import type { IDataService, Story, SaveStoryInput } from '../contracts';

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export class RealDataService implements IDataService {
  async saveStory(storyData: SaveStoryInput): Promise<string> {
    console.log('RealDataService: Saving story...');

    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    const { id, userId, title, storyText } = storyData;

    if (!userId || !title || !storyText) {
      throw new Error('User ID, title, and story text are required');
    }

    try {
      const storiesCollection = collection(db, 'stories');

      if (id) {
        // Update existing story
        const storyRef = doc(db, 'stories', id);
        await updateDoc(storyRef, {
          title,
          storyText,
          updatedAt: serverTimestamp(),
        });
        console.log('RealDataService: Story updated successfully.');
        return id;
      } else {
        // Create new story
        const newStoryRef = await addDoc(storiesCollection, {
          userId,
          title,
          storyText,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log('RealDataService: New story created successfully.');
        return newStoryRef.id;
      }
    } catch (error) {
      console.error('RealDataService: Error during saveStory:', error);
      throw new Error('Failed to save story.');
    }
  }

  async getStoriesForUser(userId: string): Promise<Story[]> {
    console.log('RealDataService: Fetching stories for user...');

    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const storiesCollection = collection(db, 'stories');
      const q = query(storiesCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const stories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate().toISOString(),
        updatedAt: doc.data().updatedAt.toDate().toISOString(),
      })) as Story[];

      console.log(
        `RealDataService: Fetched ${stories.length} stories successfully.`
      );
      return stories;
    } catch (error) {
      console.error('RealDataService: Error during getStoriesForUser:', error);
      throw new Error('Failed to fetch stories.');
    }
  }

  async getStoryById(storyId: string): Promise<Story | null> {
    console.log('RealDataService: Fetching story by ID...');

    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    if (!storyId) {
      throw new Error('Story ID is required');
    }

    try {
      const storyRef = doc(db, 'stories', storyId);
      const docSnap = await getDoc(storyRef);

      if (!docSnap.exists()) {
        console.log('RealDataService: Story not found.');
        return null;
      }

      const data = docSnap.data();
      const story: Story = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      } as Story;

      console.log('RealDataService: Story fetched successfully.');
      return story;
    } catch (error) {
      console.error('RealDataService: Error during getStoryById:', error);
      throw new Error('Failed to fetch story.');
    }
  }
}

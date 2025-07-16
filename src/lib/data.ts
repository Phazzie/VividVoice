
'use server';

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
import { db } from './firebase';


/**
 * @fileOverview This file contains all the data-fetching and data-mutation
 * functions that interact with Firestore. It is separated from the `actions.ts`
 * file to maintain a clean architecture where data access is distinct from
 * the business logic of AI interactions.
 */

/**
 * Defines the shape of a Story document in Firestore.
 */
export type Story = {
  id: string;
  userId: string;
  title: string;
  storyText: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Saves a story to Firestore. If an ID is provided, it updates the existing
 * document; otherwise, it creates a new one.
 * @param storyData The data for the story.
 * @returns The ID of the saved document.
 */
export async function saveStory(storyData: Omit<Story, 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized.');
  const { id, userId, title, storyText } = storyData;

  if (!userId || !title || !storyText) {
    throw new Error('User ID, title, and story text are required.');
  }

  const storiesCollection = collection(db, 'stories');

  if (id) {
    // Update existing story
    const storyRef = doc(db, 'stories', id);
    await updateDoc(storyRef, {
      title,
      storyText,
      updatedAt: serverTimestamp(),
    });
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
    return newStoryRef.id;
  }
}

/**
 * Fetches all stories for a given user from Firestore.
 * @param userId The ID of the user.
 * @returns An array of story objects.
 */
export async function getStoriesForUser(userId: string): Promise<Story[]> {
  if (!db) throw new Error('Firestore is not initialized.');
  const storiesCollection = collection(db, 'stories');
  const q = query(storiesCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    // Convert Firestore Timestamps to ISO strings
    createdAt: doc.data().createdAt.toDate().toISOString(),
    updatedAt: doc.data().updatedAt.toDate().toISOString(),
  })) as Story[];
}

/**
 * Fetches a single story by its ID from Firestore.
 * @param storyId The ID of the story to fetch.
 * @returns The story object, or null if not found.
 */
export async function getStoryById(storyId: string): Promise<Story | null> {
  if (!db) throw new Error('Firestore is not initialized.');
  const storyRef = doc(db, 'stories', storyId);
  const docSnap = await getDoc(storyRef);
  if (!docSnap.exists()) {
    return null;
  }
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  } as Story;
}

'use server';

import { fetch } from 'next/dist/compiled/@edge-runtime/primitives';
import baseUrl from '../../../config';

export async function createFeed(feedData) {
  try {
    const response = await fetch(baseUrl+`/feed/createFeed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating feed:', error);
    throw error;
  }
}

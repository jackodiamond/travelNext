// serverActions.js

import baseUrl from "../../../config";

export async function likeFeed(feedId, username) {
  try {
    const response = await fetch(baseUrl+`/feed/like/${feedId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error liking feed:', error);
    throw error;
  }
}

export async function commentOnFeed(feedId, username, comment) {
  try {
    console.log('Comment object:', comment); 
    const response = await fetch(baseUrl+`/feed/comment/${feedId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, comment }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error commenting on feed:', error); 
    throw error;
  }
}

export async function fetchProfilePicture(user) {
  try {
    const response = await fetch(baseUrl+`/profile/getprofile/${user}`);
    const data = await response.json();
    if (data && data.profilePic) {
      return data.profilePic;
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    throw error;
  }
}

export async function searchFeeds(name) {
  try {
    const response = await fetch(baseUrl+`/searchFeeds?name=${encodeURIComponent(name)}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching feeds:', error);
    throw error;
  }
}
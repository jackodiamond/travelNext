'use client'
import React, { useState, useEffect } from 'react';
import FeedCard from './feedCard';
import TopNav from './TopNav';
import baseUrl from '../../../config';

async function fetchFeeds(query = '') {
  try {
    const url = query ? baseUrl+`/feed/searchFeeds?name=${encodeURIComponent(query)}` : baseUrl+'/feed/feeds';
    console.log("url :",url)
    const response = await fetch(url, { next: { revalidate: 10 } });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return [];
  }
}

const Feeds = ({ initialSearchQuery = '' }) => {
  const [feeds, setFeeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    const fetchInitialFeeds = async () => {
      const initialFeeds = await fetchFeeds(initialSearchQuery);
      setFeeds(initialFeeds);
    };
    
    fetchInitialFeeds();
  }, [initialSearchQuery]);

  const handleSearch = async (query) => {
    console.log("query :",query)
    setSearchQuery(query);
    const searchedFeeds = await fetchFeeds(query);
    setFeeds(searchedFeeds);
  };

  return (
    <>
      <TopNav showSearchBar={true} handleSearch={handleSearch} />
      <div className='feedsContainer'>
        {feeds.map(feed => (
          <FeedCard key={feed._id} feed={feed} />
        ))}
      </div>
    </>
  );
};

export default Feeds;

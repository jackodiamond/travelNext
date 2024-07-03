'use client'
import React, { useState, useEffect } from 'react';
import FeedCard from './feedCard';
import TopNav from './TopNav';
import baseUrl from '../../../config';

/*
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
*/

async function fetchFeeds(page = 1, limit = 10, query = '') {
  try {
    const url = query 
      ? `${baseUrl}/feed/searchFeeds?name=${encodeURIComponent(query)}&page=${page}&limit=${limit}` 
      : `${baseUrl}/feed/feeds?page=${page}&limit=${limit}`;
    console.log("url:", url);
    const response = await fetch(url, { next: { revalidate: 10 } });
    const data = await response.json();
    console.log("feed data ", data)
    if(query==='')
    {
      return data.feeds;
    }else
    {
      return data;
    }
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return [];
  }
}


const Feeds = ({ initialSearchQuery = '' }) => {
  const [feeds, setFeeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleScroll = () => {
    if (loading) return;
  
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
  
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      console.log("page changed!");
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
   pageChanged()
  }, [page]);

  const pageChanged = async () => {
    console.log("page changed!")
    const feeds = await fetchFeeds(page,10,searchQuery);
    setFeeds(prevFeeds => [...prevFeeds, ...feeds]);
  }
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  useEffect(() => {
    const fetchInitialFeeds = async () => {
      const initialFeeds = await fetchFeeds(page,10,initialSearchQuery);
      setFeeds(initialFeeds);
    };
    
    fetchInitialFeeds();
  }, [initialSearchQuery]);

  const handleSearch = async (query) => {
    console.log("query :",query)
    setSearchQuery(query);
    if(query==='')
    {
      console.log("query empty")
      setFeeds([])
      setPage(1);
      const initialFeeds = await fetchFeeds(page,10,'');
      setFeeds(initialFeeds);
    }else
    {
      const searchedFeeds = await fetchFeeds(page,10,query);
      setFeeds([])
      setFeeds(searchedFeeds);
    }
    
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

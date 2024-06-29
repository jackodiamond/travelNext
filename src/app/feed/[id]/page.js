import React from 'react';
import FeedPage from './feedPage'; // Adjust the import based on your file structure
import baseUrl from '../../../../config';

async function fetchFeedById(id) {
  try {
    const response = await fetch(baseUrl+`/feed/feeds/${id}`,{cache: 'no-store'});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    return null;
  }
}

const FeedDetail = async ({ params }) => {

  const id=params.id;
  console.log("params ",params.id);
  const feed =  await fetchFeedById(id); // Fetch data directly in the component

  if (!feed) {
    return <div>Feed not found</div>;
  }

  return (
    <div>
      <FeedPage feed={feed} />
    </div>
  );
};

export default FeedDetail;

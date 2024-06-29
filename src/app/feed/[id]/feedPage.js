'use client'

import React, { useState, useEffect,useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { likeFeed, commentOnFeed, fetchProfilePicture } from '../feedServerAction'; // Import server actions
import MapComponent from '../MapComponent';
import UserContext from '@/app/components/UserContext';
import './feedPage.css';

const FeedPage = ({ feed }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [likesCount, setLikesCount] = useState(feed.hearts.length);
  const [comments, setComments] = useState(feed.comments);
  const [commentInput, setCommentInput] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const { setAuthor } = useContext(UserContext);

  console.log("feed : ",feed)
  useEffect(() => {
    const fetchData = async () => {
      var data = await fetchProfilePicture(feed.author);
      if(data===undefined)
      {
        data='/user.png';
      }
      setProfilePicUrl(data);
    };
    fetchData();
  }, [feed.author]);

  const handleLike = async () => {
    try {
      const data = await likeFeed(feed._id, 'exampleUser'); // Replace with actual username
      if (data.liked && !hasLiked) {
        setLikesCount(likesCount + 1);
        setHasLiked(true);
      } else if (!data.liked && hasLiked) {
        setLikesCount(likesCount - 1);
        setHasLiked(false);
      }
    } catch (error) {
      console.error('Error liking feed:', error);
    }
  };

  const handlePostComment = async () => {
    try {
      const comment = commentInput;
      const data = await commentOnFeed(feed._id, 'exampleUser', comment); // Replace with actual username and comment
      setComments([...comments, { username: 'exampleUser', comment }]);
      setCommentInput('');
    } catch (error) {
      console.error('Error commenting on feed:', error);
    }
  };

  const handleAuthorClick = (authorName) => {
    console.log("user 01 : ",authorName)
    setAuthor(authorName)
    router.push('/profile');
   
  };

  const handlePreviousImage = () => {
   
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? feed.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === feed.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBack = () => {
    router.push('/feed');
  };

  
  const formatTimePassed = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMs = now - created;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hrs`;
    } else if (diffInDays < 30) {
      return `${diffInDays} days`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} months`;
    } else {
      return `${diffInYears} years`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <button onClick={handleBack} className="text-white bg-blue-500 hover:bg-blue-700 mb-4 p-2 rounded">
  ← Back
</button>
      <h1 className="text-3xl font-bold text-center mb-4">{feed.title}</h1>
      
      {feed.imageUrls.length > 0 ? (
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePreviousImage} className="text-xl">&#8592;</button>
        <img
          src={feed.imageUrls[currentImageIndex]}
          alt={`Feed image ${currentImageIndex + 1}`}
          className="w-64 h-64 object-cover mx-auto"
        />
        <button onClick={handleNextImage} className="text-xl">&#8594;</button>
      </div>
      ):(<></>)}
      
      <div className="clickable-element flex items-center mb-4" onClick={() => handleAuthorClick(feed.author)}>
        <img
          src={profilePicUrl}
          alt="Author"
          className="w-12 h-12 rounded-full mr-4" 
        />
        <div className="text-lg font-semibold">{feed.author}</div>
      </div>
      <p className="feed-time">{formatTimePassed(feed.createdAt)}</p>
      <p className="mb-4">{feed.content}</p>
      {feed.location && (
      <MapComponent/>
      )}
      <button
        onClick={handleLike}
        className={`py-2 px-4 rounded ${hasLiked ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}
      >
        {likesCount} Like{likesCount !== 1 && 's'}
      </button>
      <div className="mt-6 bg-white-500">
        <h2 className="text-2xl mb-4">Comments</h2>
        <div className="mb-4">
          {comments.map((comment, index) => (
            <div key={index} className="rounded mb-2 bg-gray-200">
              <span className="font-semibold">{comment.username}:</span>
              <span> {comment.comment}</span>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="border rounded p-1 w-full mb-2"
        />
        <button
          onClick={handlePostComment}
          className="py-2 px-4 bg-blue-500 text-white rounded"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default FeedPage;

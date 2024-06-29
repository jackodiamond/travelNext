'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './feedCard.css';
import feedImage from './feed.jpg';
import { likeFeed, commentOnFeed, fetchProfilePicture } from './feedServerAction'; // Import server actions

function FeedCard({ feed }) {
  const router = useRouter();
  const [showReadMore, setShowReadMore] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [likesCount, setLikesCount] = useState(feed.hearts.length);
  const [comments, setComments] = useState(feed.comments);
  const contentRef = useRef(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showMapPopup, setShowMapPopup] = useState(false);

  const openImagePopup = () => {
    setShowImagePopup(true);
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
  };

  const openMapPopup = () => {
    setShowMapPopup(true);
  };

  const closeMapPopup = () => {
    setShowMapPopup(false);
  };

  useEffect(() => {
    if (contentRef.current) {
      setShowReadMore(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [feed.content]);

  useEffect(() => {
    const fetchData = async () => {
      var data = await fetchProfilePicture(feed.author);
      console.log("profile pic : ", data);
      if (data === undefined) {
        data = '/user.png';
      }
      setProfilePicUrl(data);
    };
    fetchData();
  }, [feed.author]);

  const handleReadMore = () => {
    setExpanded(!expanded);
  };

  const handleLike = async () => {
    try {
      const data = await likeFeed(feed._id, 'exampleUser'); // Replace with actual username
      if (data.liked) {
        setLikesCount(likesCount + 1);
      } else {
        setLikesCount(likesCount - 1);
      }
      console.log('Like action response:', data);
    } catch (error) {
      console.error('Error liking feed:', error);
    }
  };

  const handlePostComment = async () => {
    try {
      const comment = commentInput;
      const data = await commentOnFeed(feed._id, 'exampleUser', comment); // Replace with actual username and comment
      setComments([...comments, { username: 'exampleUser', comment }]);
      console.log('Comment action response:', data);
      setCommentInput('');
    } catch (error) {
      console.error('Error commenting on feed:', error);
    }
  };

  const handleComment = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleAuthorClick = (authorName) => {
    navigate('/profile', { state: authorName });
  };

  const handleCardClick = () => {
    router.push(`/feed/${feed._id}`);
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
    <>
      <div className={`feed-card ${expanded ? 'expanded' : ''}`} onClick={handleCardClick}>
        {feed.imageUrls.length > 0 ? (
          <img src={feed.imageUrls[0]} alt="Feed" className="feed-image" onClick={openImagePopup} />
        ) : (
          <></>
        )}

        <div className="feed-card-right">
          <h4 className="feed-author" onClick={() => handleAuthorClick(feed.author)}>
            <div className="feed-circle">
              <img src={profilePicUrl} className="circle-image" alt="Profile" />
            </div>
            <div className="author-name">{feed.author}</div>
          </h4>
          <h2 className="feed-title">{feed.title}</h2>
          <p className="feed-time">{formatTimePassed(feed.createdAt)}</p>
          <p ref={contentRef} className={`feed-text ${expanded ? 'expanded' : ''}`}>{feed.content}</p>
          {showReadMore && (
            <></>
          )}
          <div className="feed-buttons">
            <span className="like-button" onClick={handleLike}>
              <img src="heart.png" alt="Like" className="icon" /> {likesCount}
            </span>
            <span className="comment-button" onClick={handleComment}>
              <img src="comments.png" alt="Comment" className="icon" /> {comments.length}
            </span>
          </div>
          {showCommentInput && (
            <div className="comment-section">
              <div className="comments">
                {comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <span className="comment-author">{comment.username}:</span>
                    <span className="comment-text">{comment.comment}</span>
                  </div>
                ))}
              </div>
              <input
                className="comment-input-input"
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button className="comment-input-button" onClick={handlePostComment}>Post</button>
            </div>
          )}
        </div>
      </div>
      {/*
      {showImagePopup && (
        <ImagePopup imageUrls={feed.imageUrls} onClose={closeImagePopup} />
      )}
        
      {showMapPopup && feed.location && (
        <GoogleMapPopup
          lat={feed.location.latitude}
          lng={feed.location.longitude}
          onClose={closeMapPopup}
        />
      )}
        */}
    </>
  );
}

export default FeedCard;

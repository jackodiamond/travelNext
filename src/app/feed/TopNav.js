'use client'
import React, { useState, useEffect, useContext } from 'react';
import './TopNav.css'; // Import the CSS file where you define styles for TopNav
import Menu from './Menu';
import backgroundImage from './sunset.jpg';
import UserContext from '../components/UserContext';
import baseUrl from '../../../config';
import { getUsers } from '../components/WebSocketComponent';
import { eventEmitter, sendMessageHandler } from '../components/WebSocketComponent';

const TopNav = ({ coverPicPath, showCoverPic, showImageIcon, showSearchBar, handleSearch,showMessageToggle,handleMessageToggle }) => {
  const [feeds, setFeeds] = useState([]);
  const [activeMenu, setActiveMenu] = useState('feeds');
  const [formData, setFormData] = useState({ image: null });
  const [searchTerm, setSearchTerm] = useState('');
  const { username } = useContext(UserContext);
  const [coverPic, setCoverPic] = useState('');
  const [unseenCount, setUnseenCount] = useState(0);
  const [view, setView] = useState('messages'); // New state for toggling views

  useEffect(() => {
    if (coverPicPath === '' || coverPicPath === undefined) {
      coverPicPath = backgroundImage;
      setCoverPic(backgroundImage);
    } else {
      setCoverPic(coverPicPath);
    }
  }, [coverPicPath]);

  useEffect(() => {
    fetchUnseenMessagesCount();
  }, [username]);

  if (showCoverPic === undefined) {
    showCoverPic = false;
  }
  if (showImageIcon === undefined) {
    showImageIcon = false;
  }

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const fetchUnseenMessagesCount = async () => {
    try {
      const response = await fetch(baseUrl + `/messages/unseen/${username}`);
      if (response.ok) {
        const data = await response.json();
        setUnseenCount(data.unseenMessagesCount);
        console.log("unseen count updated!")
      } else {
        console.error('Failed to fetch unseen messages count:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching unseen messages count:', error);
    }
  };

  // Remove any existing listeners to avoid multiple registrations
eventEmitter.off('privateMessage', fetchUnseenMessagesCount);

// Register the event listener
eventEmitter.on('privateMessage', fetchUnseenMessagesCount);

  const handleUpdateCoverPicServer = async (updatedPic) => {
    try {
      await fetch(baseUrl + `/profile/updateProfile/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverPic: updatedPic }),
      });
      setCoverPic(updatedPic);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleUpdateCoverPic = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ image: reader.result });
        handleUpdateCoverPicServer(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleView = () => {
    setView((prevView) => (prevView === 'messages' ? 'onlineUsers' : 'messages'));

    if(view==='onlineUsers')
    {
      console.log("toggle online user")
      handleMessageToggle();
    }else
    {
      console.log("toggle get user")
      getUsers();
    }
  };

  return (
    <>
      <div className="top-nav" style={{ backgroundImage: showImageIcon ? `url(${coverPic})` : `url(${backgroundImage})`, position: 'relative' }}>
        <Menu unseenCount={unseenCount} showLogout={showImageIcon} />
        {showSearchBar && (
          <div className="search-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <div className="relative w-full max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search..."
                onChange={onSearchChange}
                className="block w-full p-2 pr-10 rounded-md border border-blue-300 bg-transparent h-8 text-white placeholder-white"
                style={{ paddingRight: '2.5rem' }} // Add space for the icon
              />
              <img src="./search.png" alt="Search Icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none" />
            </div>
          </div>
        )}
        <label htmlFor="image-upload-cover" className="placeholder-image-label">
          {showImageIcon && (
            <img src="/photo-editing.png" className="edit-icon-cover-pic" type="file" accept="image/*" id="upload-input-cover" />
          )}
        </label>
        {/* Hidden file input */}
        <input
          type="file"
          id="image-upload-cover"
          accept="image/*"
          onChange={handleUpdateCoverPic}
          style={{ display: 'none' }}
        />
        {showMessageToggle &&(
        <div className="toggle-container">
          <input
            type="checkbox"
            id="toggle-view"
            className="toggle-checkbox"
            checked={view === 'onlineUsers'}
            onChange={toggleView}
          />
          <label htmlFor="toggle-view" className="toggle-label">
            <span className="toggle-messages">Messages</span>
            <span className="toggle-online-users">Online</span>
          </label>
        </div>
        )}
        {/** 
        <div className="content">
          {view === 'messages' ? (
            <div>Messages content goes here...</div>
          ) : (
            <div>Online Users content goes here...</div>
          )}
        </div>
        */}
      </div>
    </>
  );
};

export default TopNav;

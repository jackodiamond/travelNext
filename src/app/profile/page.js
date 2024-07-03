'use client'

import React, { useContext, useState, useEffect, useRef } from 'react';
import TopNav from '../feed/TopNav';
import FeedCard from '../feed/feedCard';
import BioEditModal from './BioEditModel';
import MessagingComponent from './MessagingComponent';
import UserContext from '../components/UserContext';
import { useRouter } from 'next/navigation';
import'./ProfilePage.css'; // Import CSS module for styling
import baseUrl from '../../../config';

const ProfilePage = () => {
  const router = useRouter();
  const {username,isLoggedIn,author } = useContext(UserContext); 
  const [feeds, setFeeds] = useState([]);
  const [formData, setFormData] = useState({ image: null });
  const [profileData, setProfileData] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const [showBioModal, setShowBioModal] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [coverPic, setCoverPic] = useState('');
  const userNameRef = useRef(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openMessagingComponents, setOpenMessagingComponents] = useState([]);

  const fetchFeedsByAuthor = async (authorName) => {
    try {
      console.log("fetch feed! "+authorName);
      const response = await fetch(baseUrl+`/feed/feeds?author=${authorName}`);
      const data = await response.json();
      console.log("profile data ",data);
      setFeeds(data.feeds);
    } catch (error) {
      console.error('Error fetching feeds:', error);
    }
  };

  useEffect(() => {
    console.log("user query ",router.query)
  }, [router.query]); // Re-run effect when query changes

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to "Page Not Found" page if not logged in
      router.push('/LoginToView');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (author == null) {
      userNameRef.current = username;
    } else {
      userNameRef.current = author;
    }
    fetchFeedsByAuthor(userNameRef.current);
  }, [author, username]);

  useEffect(() => {
    setIsMounted(true);
    fetchProfileData();

    return () => {
      setIsMounted(false);
    };
  }, [username]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(baseUrl+`/profile/getprofile/${userNameRef.current}`);
      const data = await response.json();
      if (data) {
        setProfileData(data);
        setFormData({ image: data.profilePic });
        setCoverPic(data.coverPic);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleEditBio = () => {
    setShowBioModal(true);
    setNewBio(profileData?.bio || '');
  };

  const handleCloseBioModal = () => {
    setShowBioModal(false);
  };

  const handleUpdateBio = async (updatedBio) => {
    try {
      await fetch(baseUrl+`/profile/updateProfile/${userNameRef.current}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: updatedBio }),
      });
      setProfileData((prevData) => ({ ...prevData, bio: updatedBio }));
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleUpdateProfilePicServer = async (updatedPic) => {
    try {
      await fetch(baseUrl+`/profile/updateProfile/${userNameRef.current}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePic: updatedPic }),
      });
      setProfileData((prevData) => ({ ...prevData, profilePic: updatedPic }));
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleUpdateProfilePic = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ image: reader.result });
        handleUpdateProfilePicServer(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openMessaging = () => {
    const newId = Date.now();
    setOpenMessagingComponents([...openMessagingComponents, newId]);
  };

  const closeMessaging = (id) => {
    setOpenMessagingComponents(openMessagingComponents.filter((compId) => compId !== id));
  };

  return (

      <>
        {loading ? (
          <TopNav showCoverPic={true} showImageIcon={true} />
        ) : (
          <TopNav coverPicPath={coverPic} showCoverPic={true} showImageIcon={true} />
        )}
        <div className='profile-container'>
          <div className='profile-info'>
            <div className='profile-pic-container'>
              <img src={formData.image || 'user.png'} alt="Profile" className='profile-pic' />
              <div className='profile-name overflow-hidden whitespace-nowrap'>{userNameRef.current}</div>
              <label htmlFor="image-upload" className='placeholderImageLabel'>
                {author == null && <img src="/photo-editing.png" className='edit-icon' />}
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleUpdateProfilePic}
                style={{ display: 'none' }}
              />
            </div>
            <div className='bio'>
              {profileData?.bio || <>My happy place is anywhere with a horizon.</>}
              {author == null && <img src="/edit.png" alt="Edit" className='edit-icon-bio' onClick={handleEditBio} />}
            </div>
            {author != null && (
              <div className='friend-buttons'>
                <button className='friend-button' onClick={openMessaging}>Message</button>
              </div>
            )}
          </div>
        </div>
        <div className='feeds-container'>
          {feeds.map((feed) => (
            <FeedCard key={feed._id} feed={feed} />
          ))}
        </div>
        {showBioModal && (
          <BioEditModal onClose={handleCloseBioModal} onUpdate={handleUpdateBio} initialBio={newBio} />
        )}
        {openMessagingComponents.map((id) => (
          <MessagingComponent key={id} senderName={username} recipientName={userNameRef.current} onClose={() => closeMessaging(id)} />
        ))}
      </>

  );
};

export default ProfilePage;

'use client';

import React, { useState, useContext,useEffect } from 'react';
import { EditorState } from 'draft-js';
//import EditorWithImageUpload from './EditorWithImageUpload';
import TopNav from '../feed/TopNav';
import { createFeed } from './CreateFeed';
import './CreateFeed.css'; // Adjust the path based on your structure
import { useRouter } from 'next/navigation';
import UserContext from '../components/UserContext';

const CreateFeed = () => {
  const router = useRouter();
  const {username,isLoggedIn } = useContext(UserContext); 
  const [imageData, setImageData] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: EditorState.createEmpty(),
    images: [],
    location: { lat: null, lng: null }
  });

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to "Page Not Found" page if not logged in
      router.push('/404');
    }
  }, [isLoggedIn]);

  const handleEditorChange = (editorState) => {
    setFormData({
      ...formData,
      content: editorState,
    });
  };


  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files) {
      const readers = files.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((images) => {
        setFormData({
          ...formData,
          images: [...formData.images, ...images],
        });
        setImageData([...formData.images, ...images]);
      });
    }
  };

  const handleLocationChange = (location) => {
    setFormData({
      ...formData,
      location,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFeed = {
        title: formData.title,
        author: username,
        content: formData.content.getCurrentContent().getPlainText('\u0001'),
        imageContents: imageData,
        location: formData.location,
      };

      console.log("new feed ", newFeed);
      // Call server action
      await createFeed(newFeed);
      setFormData({
        title: '',
        content: EditorState.createEmpty(),
        images: [],
        location: { lat: null, lng: null },
      });
      alert('Feed created successfully!');
    } catch (error) {
      console.error('Error creating feed:', error);
      alert('Error creating feed. Please try again.');
    }
  };

  return (

      <>
        <TopNav showImageIcon={false} />
        <div className="create-feed-form-container">
          <h2 className="create-feed-heading"></h2>
          <form onSubmit={handleSubmit} className="create-feed-form">
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Title"
                style={{ textAlign: 'center' }}
              />
            </div>
            {/*
            <EditorWithImageUpload
              editorState={formData.content}
              onEditorStateChange={handleEditorChange}
              handleImageUpload={handleImageUpload}
              formData={formData}
              setLocation={handleLocationChange}
            />
            */}
            <button type="submit" className="create-feed-button">Create Feed</button>
          </form>
        </div>
      </>

  );
};

export default CreateFeed;

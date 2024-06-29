'use client';

import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import MapComponent from '../feed/MapComponent';

function EditorWithImageUpload({ editorState, onEditorStateChange, handleImageUpload, formData, setLocation }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMapVisible, setIsMapVisible] = useState(true);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % formData.images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + formData.images.length) % formData.images.length);
  };

  const toggleMapVisibility = () => {
    setIsMapVisible((prevState) => !prevState);
  };

  return (
    <div style={styles.container}>
      <div style={styles.editorContainer}>
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          placeholder="Write something..."
          toolbar={{
            options: ['inline', 'textAlign'],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
          }}
        />
      </div>
      <div style={styles.sidebar}>
        <div style={styles.uploadButtonContainer}>
          <label htmlFor="image-upload">
            <img src="/uploadImage.png" alt="Upload Image" style={styles.uploadIcon} />
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {formData.images.length > 0 && (
          <div style={styles.imageContainer}>
            <div style={styles.imageWrapper}>
              <div style={styles.imageCounter}>
                {currentImageIndex + 1}/{formData.images.length}
              </div>
              <img
                src={formData.images[currentImageIndex]}
                alt={`Uploaded ${currentImageIndex}`}
                style={styles.image}
              />
              {formData.images.length > 1 && (
                <>
                  <button onClick={handlePreviousImage} style={styles.navButton}>
                    &#8592;
                  </button>
                  <button onClick={handleNextImage} style={styles.navButton}>
                    &#8594;
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div style={styles.mapButtonContainer}>
          <img
            src="/country-location-icon.png"
            alt="Enable Location"
            style={styles.mapIcon}
            onClick={toggleMapVisibility}
          />
        </div>

        {isMapVisible && (
          <div style={styles.mapContainer}>
            <MapComponent mapLocation={setLocation} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  editorContainer: {
    flex: '1 1 60%',
    minWidth: '300px',
    height: '540px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  sidebar: {
    flex: '1 1 35%',
    minWidth: '300px',
    height: '600px',
    position: 'relative',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  uploadButtonContainer: {
    position: 'absolute',
    top: '0',
    textAlign: 'center',
  },
  uploadIcon: {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'absolute',
    top: '60px',
    textAlign: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 'auto',
  },
  imageCounter: {
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  image: {
    maxWidth: '150px',
    height: 'auto',
    borderRadius: '4px',
    objectFit: 'cover',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer', 
    padding: '10px',
  },
  mapButtonContainer: {
    position: 'absolute',
    top: '180px',
    textAlign: 'center',
  },
  mapIcon: {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
  },
  mapContainer: {
    position: 'absolute',
    top: '240px',
    width: '100%',
    marginLeft: '20px',
    textAlign: 'center',
  },
};

export default EditorWithImageUpload;

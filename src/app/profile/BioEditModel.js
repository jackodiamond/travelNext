import React, { useState } from 'react';
import './BioEditModel.css'; // Import CSS module for styling

function BioEditModal({ onClose, onUpdate, initialBio }) {
  const [bio, setBio] = useState(initialBio);

  const handleUpdate = () => {
    onUpdate(bio);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <textarea
          className={styles.bioTextarea}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
        />
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button className={styles.updateButton} onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default BioEditModal;

import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <button className={styles.closeCornerBtn} onClick={onClose}>
          <X size={18} />
        </button>
        
        <div className={styles.modalHeader}>
          <div className={styles.alertIconCircle}>
            <ShieldAlert size={28} color="var(--color-danger)" />
          </div>
          <h3>{title}</h3>
        </div>

        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Yes, Purge Profile
          </button>
        </div>
      </div>
    </div>
  );
}
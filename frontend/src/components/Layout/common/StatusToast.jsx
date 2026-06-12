import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import styles from './StatusToast.module.css';

export default function StatusToast({ show, message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toastCard}>
        <div className={styles.iconCircle}>
          <CheckCircle2 size={22} color="#16a34a" />
        </div>
        <div className={styles.messageContent}>
          <h4>Success</h4>
          <p>{message}</p>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
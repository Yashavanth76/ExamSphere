// src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Shield, User, GraduationCap } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === 'admin';
  const currentPath = location.pathname;

  return (
    <header className={styles.navbar}>
      <div className={`${styles.navContainer} container`}>
        {/* Brand Logo */}
        <Link to={isAdmin ? "/admin" : "/dashboard"} className={styles.logo}>
          <GraduationCap className={styles.logoIcon} size={24} />
          <span className={styles.logoText}>ExamsSphere</span>
        </Link>

        {/* Navigation Actions */}
        <nav className={styles.navMenu}>
          {isAdmin ? (
            <Link 
              to="/admin" 
              className={`${styles.navLink} ${currentPath === '/admin' ? styles.activeLink : ''}`}
            >
              Console Panel
            </Link>
          ) : (
            <Link 
              to="/dashboard" 
              className={`${styles.navLink} ${currentPath === '/dashboard' ? styles.activeLink : ''}`}
            >
              Workspace
            </Link>
          )}
        </nav>

        {/* User context menu */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={`${styles.avatar} ${isAdmin ? styles.adminAvatar : styles.studentAvatar}`}>
              {isAdmin ? <Shield size={16} /> : <User size={16} />}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.username}>{user.username}</span>
              <span className={styles.roleBadge}>
                {isAdmin ? 'Administrator' : 'Student Access'}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

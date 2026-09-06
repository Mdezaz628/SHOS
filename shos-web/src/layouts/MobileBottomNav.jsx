import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, AlertOctagon, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_ROUTES } from '../constants/roles';

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuth();

  const currentHomeRoute = ROLE_ROUTES[currentRole] || '/admin';

  return (
    <nav className="shos-mobile-bottom-nav">
      <button
        type="button"
        className={`mobile-nav-btn ${location.pathname === currentHomeRoute ? 'active' : ''}`}
        onClick={() => navigate(currentHomeRoute)}
      >
        <Home size={18} />
        <span>Home</span>
      </button>

      <button
        type="button"
        className="mobile-nav-btn"
        onClick={() => navigate('/patient')}
      >
        <Calendar size={18} />
        <span>Appt</span>
      </button>

      <button
        type="button"
        className="mobile-nav-btn"
        onClick={() => navigate('/admin')}
      >
        <AlertOctagon size={18} style={{ color: 'var(--color-critical)' }} />
        <span>Alerts</span>
      </button>

      <button
        type="button"
        className="mobile-nav-btn"
        onClick={() => navigate('/welcome')}
      >
        <User size={18} />
        <span>Profile</span>
      </button>
    </nav>
  );
};

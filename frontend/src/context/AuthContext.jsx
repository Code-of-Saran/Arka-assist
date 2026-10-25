import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Default project user
const DEFAULT_USER = {
  username: 'farmer',
  name: 'VSBCETC [CSE PROJECT]',
  role: 'Farmer & Agronomist',
  location: 'Coimbatore, Tamil Nadu',
  preferred_language: 'en',
  primary_crop: 'Rice (Paddy)',
  farm_size: '4.5 Acres',
  soil_type: 'Clay Loam',
  irrigation: 'Drip & Borewell'
};

export const AuthProvider = ({ children }) => {
  // Load user and migrate old storage if present
  const [user, setUser] = useState(() => {
    // Purge legacy storage keys
    const legacySaved = localStorage.getItem('agrivision_user');
    const currentSaved = localStorage.getItem('arka_assist_user');

    if (legacySaved) {
      localStorage.removeItem('agrivision_user');
    }

    const saved = currentSaved || legacySaved;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const updatedUser = {
          ...DEFAULT_USER,
          ...parsed,
          name: DEFAULT_USER.name
        };

        localStorage.setItem('arka_assist_user', JSON.stringify(updatedUser));
        return updatedUser;
      } catch (error) {
        localStorage.setItem('arka_assist_user', JSON.stringify(DEFAULT_USER));
        return DEFAULT_USER;
      }
    }

    return DEFAULT_USER;
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const legacyAuth = localStorage.getItem('agrivision_auth');
    if (legacyAuth) {
      localStorage.removeItem('agrivision_auth');
    }
    return localStorage.getItem('arka_assist_auth') === 'true' || legacyAuth === 'true';
  });

  // Save user whenever user data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('arka_assist_user', JSON.stringify(user));
    }
  }, [user]);

  // Login function
  const login = (username, password, isDemo = false) => {
    const validPass = ['arka-assist', 'arkaassist'];

    if (
      isDemo ||
      (
        username.toLowerCase() === 'farmer' &&
        validPass.includes((password || '').toLowerCase())
      )
    ) {
      const activeUser = {
        ...DEFAULT_USER
      };

      setUser(activeUser);
      setIsAuthenticated(true);

      localStorage.setItem('arka_assist_auth', 'true');
      localStorage.setItem('arka_assist_user', JSON.stringify(activeUser));

      // Clean legacy keys
      localStorage.removeItem('agrivision_auth');
      localStorage.removeItem('agrivision_user');

      return {
        success: true,
        user: activeUser
      };
    }

    return {
      success: false,
      error: 'Invalid credentials. Try demo credentials: farmer / arka-assist'
    };
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('arka_assist_auth');
    localStorage.removeItem('agrivision_auth');
    localStorage.removeItem('agrivision_user');
  };

  // Update profile
  const updateProfile = (updatedData) => {
    setUser(prev => {
      const merged = {
        ...prev,
        ...updatedData,
        name: DEFAULT_USER.name
      };

      localStorage.setItem('arka_assist_user', JSON.stringify(merged));
      return merged;
    });
  };

  // Reset profile
  const resetProfile = () => {
    const activeUser = {
      ...DEFAULT_USER
    };

    setUser(activeUser);
    localStorage.setItem('arka_assist_user', JSON.stringify(activeUser));
    return activeUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        resetProfile,
        defaultUser: DEFAULT_USER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
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

  // Load user and automatically fix old stored names
  const [user, setUser] = useState(() => {

    const saved = localStorage.getItem('agrivision_user');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Keep all existing profile details
        // but force the project display name
        const updatedUser = {
          ...DEFAULT_USER,
          ...parsed,
          name: DEFAULT_USER.name
        };

        localStorage.setItem(
          'agrivision_user',
          JSON.stringify(updatedUser)
        );

        return updatedUser;

      } catch (error) {
        localStorage.setItem(
          'agrivision_user',
          JSON.stringify(DEFAULT_USER)
        );

        return DEFAULT_USER;
      }
    }

    return DEFAULT_USER;
  });


  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('arka_assist_auth') === 'true' || localStorage.getItem('agrivision_auth') === 'true';
  });


  // Save user whenever user data changes
  useEffect(() => {

    if (user) {
      localStorage.setItem('arka_assist_user', JSON.stringify(user));
      localStorage.setItem('agrivision_user', JSON.stringify(user));
    }

  }, [user]);


  // Login function
  const login = (username, password, isDemo = false) => {
    const validPass = ['agrivision', 'arka-assist', 'arkaassist'];

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
      localStorage.setItem('agrivision_auth', 'true');

      localStorage.setItem('arka_assist_user', JSON.stringify(activeUser));
      localStorage.setItem('agrivision_user', JSON.stringify(activeUser));

      return {
        success: true,
        user: activeUser
      };
    }

    return {
      success: false,
      error:
        'Invalid credentials. Try demo credentials: farmer / agrivision or arka-assist'
    };
  };


  // Logout
  const logout = () => {

    setIsAuthenticated(false);

    localStorage.removeItem('arka_assist_auth');
    localStorage.removeItem('agrivision_auth');

  };


  // Update profile
  const updateProfile = (updatedData) => {

    setUser(prev => {

      const merged = {
        ...prev,
        ...updatedData,

        // Always keep project name
        name: DEFAULT_USER.name
      };

      localStorage.setItem(
        'agrivision_user',
        JSON.stringify(merged)
      );

      return merged;

    });

  };


  // Reset profile
  const resetProfile = () => {

    const activeUser = {
      ...DEFAULT_USER
    };

    setUser(activeUser);

    localStorage.setItem(
      'agrivision_user',
      JSON.stringify(activeUser)
    );

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
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;

};
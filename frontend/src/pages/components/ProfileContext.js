import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfileContext = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const updateProfileImage = (imageUrl) => {
    setProfileImageUrl(imageUrl);
  };

  return (
    <ProfileContext.Provider value={{ profileImageUrl, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

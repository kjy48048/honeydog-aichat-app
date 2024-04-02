import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

// UserContext를 사용하는 Hook
export const useUser = () => useContext(UserContext);

// UserProvider 유저 정보 관리
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 사용자 정보 상태

    // 로그인 함수
    const userIn = (userData) => {
      console.log('=== userIn ===');
      setUser(userData);
    };

    const updateUser = (updatedUser) => {
      setUser(updatedUser); // 사용자 정보 업데이트
    };

    // 로그아웃 함수
    const userOut = () => {
      console.log('=== userOut ===');
      setUser(null);
    };
    return (
      <UserContext.Provider value={{ user, userIn, userOut, updateUser }}>
        {children}
      </UserContext.Provider>
    );
  };

export default UserProvider;

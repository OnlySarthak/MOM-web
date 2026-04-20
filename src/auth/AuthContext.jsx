import React, { createContext, useContext, useState } from 'react';
import { getUser, logout as authLogout } from './auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());

  // setUser is exposed so LoginPage can push the real API user in after loginApi()
  function updateUser(userData) {
    setUser(userData);
  }

  function logout() {
    authLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { createContext, useContext, useState } from 'react';
import { getUser, login as authLogin, logout as authLogout } from './auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());

  function login(email, password) {
    const result = authLogin(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }

  function logout() {
    authLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

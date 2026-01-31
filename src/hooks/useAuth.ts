import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('petstore_user'));

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('petstore_user');
      setUser(storedUser);
    };

    window.addEventListener('storage', checkUser);
    window.addEventListener('user-login-update', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('user-login-update', checkUser);
    };
  }, []);

  const login = (username: string) => {
    localStorage.setItem('petstore_user', username);
    window.dispatchEvent(new Event('user-login-update'));
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem('petstore_user');
    window.dispatchEvent(new Event('user-login-update'));
    setUser(null);
  };

  return { user, login, logout };
};

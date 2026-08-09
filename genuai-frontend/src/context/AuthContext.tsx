import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, sendOtp as apiSendOtp, verifyOtp as apiVerifyOtp, requestPasswordReset, resetPassword as apiResetPassword, getMe } from '../services/authService';

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  role: 'candidate' | 'company' | 'admin' | 'institution';
  phone?: string;
  college?: string;
  github?: string;
  linkedin?: string;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (data: any) => Promise<any>;
  verifyOtpAndRegister: (email: string, otp: string) => Promise<AuthUser>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<any>;
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => Promise<any>;
  handleOAuthLogin: (userData: any) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Validate and restore session on mount
  const refreshSession = useCallback(async () => {
    const saved = localStorage.getItem('genuai_user');
    if (!saved) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      const userToken = parsed.token || parsed.user?.token;
      
      // Wipe any legacy fake sessions or malformed storage
      if (!userToken || parsed.user?.id === 101 || parsed.id === 101) {
        localStorage.removeItem('genuai_user');
        sessionStorage.clear();
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      // Verify token authenticity against backend session endpoint
      try {
        const res = await getMe();
        if (res.data?.user && res.data.user.id !== 101) {
          const verifiedUser: AuthUser = {
            ...res.data.user,
            token: userToken,
          };
          setUser(verifiedUser);
          setToken(userToken);
          localStorage.setItem('genuai_user', JSON.stringify({ user: verifiedUser, token: userToken }));
        } else {
          throw new Error('Invalid user payload');
        }
      } catch {
        // If verification fails with 401 or user not found, clear invalid session
        localStorage.removeItem('genuai_user');
        sessionStorage.clear();
        setUser(null);
        setToken(null);
      }
    } catch {
      localStorage.removeItem('genuai_user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    const res = await apiLogin({ email, password });
    if (!res.data || !res.data.user || !res.data.token) {
      throw new Error('Invalid email or password.');
    }

    // Explicitly reject any legacy mock sessions from stale caches
    if (res.data.user.id === 101) {
      throw new Error('Invalid email or password.');
    }

    const authenticatedUser: AuthUser = {
      ...res.data.user,
      token: res.data.token,
    };

    setUser(authenticatedUser);
    setToken(res.data.token);
    localStorage.setItem('genuai_user', JSON.stringify({ user: authenticatedUser, token: res.data.token }));
    return authenticatedUser;
  };

  const signUp = async (data: any) => {
    return await apiSendOtp(data);
  };

  const verifyOtpAndRegister = async (email: string, otp: string): Promise<AuthUser> => {
    const res = await apiVerifyOtp({ email, otp });
    if (!res.data || !res.data.user || !res.data.token || res.data.user.id === 101) {
      throw new Error('Invalid registration response.');
    }

    const authenticatedUser: AuthUser = {
      ...res.data.user,
      token: res.data.token,
    };

    setUser(authenticatedUser);
    setToken(res.data.token);
    localStorage.setItem('genuai_user', JSON.stringify({ user: authenticatedUser, token: res.data.token }));
    return authenticatedUser;
  };

  const signOut = () => {
    localStorage.removeItem('genuai_user');
    sessionStorage.clear();
    setUser(null);
    setToken(null);
  };

  const forgotPassword = async (email: string) => {
    return await requestPasswordReset({ email });
  };

  const resetPasswordWithOtp = async (email: string, otp: string, newPassword: string) => {
    return await apiResetPassword({ email, otp, newPassword });
  };

  const handleOAuthLogin = (userData: any) => {
    if (!userData || userData.id === 101) return;

    const authenticatedUser: AuthUser = {
      id: userData.id || userData.user?.id,
      name: userData.name || userData.user?.name || 'User',
      email: userData.email || userData.user?.email,
      role: userData.role || userData.user?.role || 'candidate',
      token: userData.token,
    };

    setUser(authenticatedUser);
    setToken(userData.token);
    localStorage.setItem('genuai_user', JSON.stringify({ user: authenticatedUser, token: userData.token }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        verifyOtpAndRegister,
        signOut,
        forgotPassword,
        resetPasswordWithOtp,
        handleOAuthLogin,
        refreshSession,
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

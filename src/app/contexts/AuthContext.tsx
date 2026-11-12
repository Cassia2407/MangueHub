import { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  name: string;
  email: string;
  course: string;
  avatar: string;
  photoUrl?: string;
  gender?: string;
  sexuality?: string;
  disabilities?: string[];
  bio?: string;
  phone?: string;
  social?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, course: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "falamangue_user";

const MOCK_USER: AuthUser = {
  name: "Marina Souza",
  email: "marina@universidade.edu.br",
  course: "Engenharia Ambiental",
  avatar: "MS",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  async function login(_email: string, _password: string) {
    await new Promise((r) => setTimeout(r, 900));
    setUser(MOCK_USER);
  }

  async function signup(name: string, email: string, course: string, _password: string) {
    await new Promise((r) => setTimeout(r, 1100));
    const initials = name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
    setUser({ name, email, course, avatar: initials });
  }

  function updateProfile(data: Partial<AuthUser>) {
    setUser((prev) => prev ? { ...prev, ...data } : prev);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

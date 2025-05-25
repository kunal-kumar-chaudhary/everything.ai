export interface ApiResponse {
  success: boolean;
  message: string;
}

// defining type for user to be used with authentication context
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// defining type for AuthContext
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: unknown) => Promise<unknown>,
  logout: () => Promise<void>;
}


export interface LoginResponse {
    success: boolean;
    message?: string;
    payload?: object;
}

export interface Message {
  chatId: string;
  role: "user"|"assistant";
  content: string;
  createdAt: string;
  tokens: number;
}

export interface Chat {
  _id: string;
  title: string;
  userId: string;
  lastMessage: string;
  updatedAt: string;
  totalTokens: number;
}
// --- Auth Types ---
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

// --- Model Types ---
export interface Tag {
  id: number; // or string if you switched to UUID
  name: string;
}

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string;
  ai_summary?: string;
  user_id: string;
  tags: Tag[];
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  bookmarks: Bookmark[];
}

// --- Input Types (for creation/updates) ---
export interface BookmarkCreate {
  title: string;
  url: string;
  description?: string;
  tags: string[]; // Frontend sends ["python", "api"] strings
}

export interface BookmarkUpdate {
  title?: string;
  url?: string;
  description?: string;
  tags?: string[];
}

export interface UserUpdate {
  email?: string;
  password?: string;
  full_name?: string;
}

export interface TagCreate {
  name: string;
}

export interface TagUpdate {
  name: string;
}
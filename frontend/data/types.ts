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
  name?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  aiSummary?: string;
  user_id: string;
  tags: Tag[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  bookmarks: Bookmark[];
}

export interface BookmarkCreate {
  title: string;
  url: string;
  description?: string;
  tags: string[];
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
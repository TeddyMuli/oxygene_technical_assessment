import type { 
  LoginRequest, RegisterRequest, TokenResponse, User, UserUpdate,
  Bookmark, BookmarkCreate, BookmarkUpdate, 
  Tag, TagCreate, TagUpdate 
} from './types';

async function request<T>(
  url: string, 
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE', 
  body?: any, 
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API call failed: ${response.statusText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const register = (apiUrl: string, data: RegisterRequest) => 
  request<User>(`${apiUrl}/register`, 'POST', data);

export const login = (apiUrl: string, data: LoginRequest) => 
  request<TokenResponse>(`${apiUrl}/login`, 'POST', data);

export const getMe = (apiUrl: string, token: string) => 
  request<User>(`${apiUrl}/me`, 'GET', undefined, token);

export const updateMe = (apiUrl: string, token: string, data: UserUpdate) => 
  request<User>(`${apiUrl}/me`, 'PATCH', data, token);

export const deleteMe = (apiUrl: string, token: string) => 
  request<{ ok: boolean }>(`${apiUrl}/me`, 'DELETE', undefined, token);

export const createBookmark = (apiUrl: string, token: string, data: BookmarkCreate) => 
  request<Bookmark>(`${apiUrl}/bookmarks/`, 'POST', data, token);

export const getBookmarks = (apiUrl: string, token: string, skip = 0, limit = 100) => 
  request<Bookmark[]>(`${apiUrl}/bookmarks/?skip=${skip}&limit=${limit}`, 'GET', undefined, token);

export const getBookmark = (apiUrl: string, token: string, bookmarkId: string) => 
  request<Bookmark>(`${apiUrl}/bookmarks/${bookmarkId}`, 'GET', undefined, token);

export const updateBookmark = (apiUrl: string, token: string, bookmarkId: string, data: BookmarkUpdate) => 
  request<Bookmark>(`${apiUrl}/bookmarks/${bookmarkId}`, 'PATCH', data, token);

export const deleteBookmark = (apiUrl: string, token: string, bookmarkId: string) => 
  request<{ ok: boolean }>(`${apiUrl}/bookmarks/${bookmarkId}`, 'DELETE', undefined, token);

export const createTag = (apiUrl: string, token: string, data: TagCreate) => 
  request<Tag>(`${apiUrl}/tags/`, 'POST', data, token);

export const getTags = (apiUrl: string, token: string) => 
  request<Tag[]>(`${apiUrl}/tags/`, 'GET', undefined, token);

export const getTag = (apiUrl: string, token: string, tagId: string) => 
  request<Tag>(`${apiUrl}/tags/${tagId}`, 'GET', undefined, token);

export const updateTag = (apiUrl: string, token: string, tagId: string, data: TagUpdate) => 
  request<Tag>(`${apiUrl}/tags/${tagId}`, 'PATCH', data, token);

export const deleteTag = (apiUrl: string, token: string, tagId: string) => 
  request<{ ok: boolean }>(`${apiUrl}/tags/${tagId}`, 'DELETE', undefined, token);

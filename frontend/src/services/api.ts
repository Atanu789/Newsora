import axios from 'axios';
import { NewsDetail, PaginatedNews } from '@/lib/types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 12000
});

export async function fetchNews(page = 1, pageSize = 8): Promise<PaginatedNews> {
  const { data } = await api.get('/news', { params: { page, pageSize } });
  return data;
}

export async function fetchNewsByCategory(category: string, page = 1, pageSize = 8): Promise<PaginatedNews> {
  const { data } = await api.get('/news', { params: { category, page, pageSize } });
  return data;
}

export async function fetchNewsById(id: string | number): Promise<NewsDetail> {
  const { data } = await api.get(`/news/${id}`);
  return data;
}

export async function submitNews(payload: { content: string; mediaUrl?: string; category?: string }, token: string) {
  const { data } = await api.post('/submissions', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function login(credentials: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

export async function register(payload: { name: string; email: string; password: string }) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function trackActivity(payload: { newsId: number; action: string; readTime?: number }, token: string) {
  const { data } = await api.post('/activity', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

import { http } from './http';

export async function listNews(params = {}) {
  const { data } = await http.get('/news', { params });
  return data;
}

export async function getNews(id) {
  const { data } = await http.get(`/news/${id}`);
  return data;
}

export async function createNews(payload) {
  const { data } = await http.post('/news', payload);
  return data;
}

export async function updateNews(id, payload) {
  const { data } = await http.put(`/news/${id}`, payload);
  return data;
}

export async function deleteNews(id) {
  const { data } = await http.delete(`/news/${id}`);
  return data;
}

export async function getPublicNews(params = {}) {
  const { data } = await http.get('/news/public', { params });
  return data;
}

export async function getPublicNewsById(id) {
  const { data } = await http.get(`/news/public/${id}`);
  return data;
}

export async function aiGenerateNews(payload) {
  const { data } = await http.post('/news/ai-generate', payload);
  return data;
}


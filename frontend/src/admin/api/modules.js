import { http } from './http';

export async function listModules(params = {}) {
  const { data } = await http.get('/modules', { params });
  return data;
}

export async function getModule(id) {
  const { data } = await http.get(`/modules/${id}`);
  return data;
}

export async function createModule(payload) {
  const { data } = await http.post('/modules', payload);
  return data;
}

export async function updateModule(id, payload) {
  const { data } = await http.put(`/modules/${id}`, payload);
  return data;
}

export async function deleteModule(id) {
  const { data } = await http.delete(`/modules/${id}`);
  return data;
}

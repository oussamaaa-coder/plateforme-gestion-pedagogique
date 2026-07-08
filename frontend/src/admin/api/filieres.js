import { http } from './http';

export async function listFilieres(params = {}) {
  const { data } = await http.get('/filieres', { params });
  return data;
}

export async function getFiliere(id) {
  const { data } = await http.get(`/filieres/${id}`);
  return data;
}

export async function createFiliere(payload) {
  const { data } = await http.post('/filieres', payload);
  return data;
}

export async function updateFiliere(id, payload) {
  const { data } = await http.put(`/filieres/${id}`, payload);
  return data;
}

export async function deleteFiliere(id) {
  const { data } = await http.delete(`/filieres/${id}`);
  return data;
}


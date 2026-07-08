import { http } from './http';

export async function listGroupes(params = {}) {
  const { data } = await http.get('/groupes', { params });
  return data;
}

export async function getGroupe(id) {
  const { data } = await http.get(`/groupes/${id}`);
  return data;
}

export async function createGroupe(payload) {
  const { data } = await http.post('/groupes', payload);
  return data;
}

export async function updateGroupe(id, payload) {
  const { data } = await http.put(`/groupes/${id}`, payload);
  return data;
}

export async function deleteGroupe(id) {
  const { data } = await http.delete(`/groupes/${id}`);
  return data;
}


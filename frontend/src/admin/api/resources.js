import { http } from './http';

export async function listResources(params = {}) {
  const { data } = await http.get('/resources', { params });
  return data;
}

export async function getResource(id) {
  const { data } = await http.get(`/resources/${id}`);
  return data;
}

export async function createResource(payload) {
  const { data } = await http.post('/resources', payload);
  return data;
}

export async function updateResource(id, payload) {
  const { data } = await http.put(`/resources/${id}`, payload);
  return data;
}

export async function deleteResource(id) {
  const { data } = await http.delete(`/resources/${id}`);
  return data;
}

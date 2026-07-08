import { http } from './http';

export async function listAdministrators(params = {}) {
  const { data } = await http.get('/administrators', { params });
  return data;
}

export async function getAdministrator(id) {
  const { data } = await http.get(`/administrators/${id}`);
  return data;
}

export async function createAdministrator(payload) {
  const { data } = await http.post('/administrators', payload);
  return data;
}

export async function updateAdministrator(id, payload) {
  const { data } = await http.put(`/administrators/${id}`, payload);
  return data;
}

export async function deleteAdministrator(id) {
  const { data } = await http.delete(`/administrators/${id}`);
  return data;
}

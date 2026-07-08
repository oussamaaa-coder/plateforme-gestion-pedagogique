import { http } from './http';

export async function listSalles(params = {}) {
  const { data } = await http.get('/salles', { params });
  return data;
}

export async function getSalle(id) {
  const { data } = await http.get(`/salles/${id}`);
  return data;
}

export async function getSalleOccupancy(id) {
  const { data } = await http.get(`/salles/${id}/occupancy`);
  return data;
}

export async function createSalle(payload) {
  const { data } = await http.post('/salles', payload);
  return data;
}

export async function updateSalle(id, payload) {
  const { data } = await http.put(`/salles/${id}`, payload);
  return data;
}

export async function deleteSalle(id) {
  const { data } = await http.delete(`/salles/${id}`);
  return data;
}

import { http } from './http';

export async function listAbsences(params = {}) {
  const { data } = await http.get('/absences', { params });
  return data;
}

export async function getAbsence(id) {
  const { data } = await http.get(`/absences/${id}`);
  return data;
}

export async function createAbsence(payload) {
  const { data } = await http.post('/absences', payload);
  return data;
}

export async function updateAbsence(id, payload) {
  const { data } = await http.put(`/absences/${id}`, payload);
  return data;
}

export async function deleteAbsence(id) {
  const { data } = await http.delete(`/absences/${id}`);
  return data;
}

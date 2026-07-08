import { http } from './http';

export async function listSchedule(params = {}) {
  const { data } = await http.get('/schedule', { params });
  return data;
}

export async function getSchedule(id) {
  const { data } = await http.get(`/schedule/${id}`);
  return data;
}

export async function createSchedule(payload) {
  const { data } = await http.post('/schedule', payload);
  return data;
}

export async function updateSchedule(id, payload) {
  const { data } = await http.put(`/schedule/${id}`, payload);
  return data;
}

export async function deleteSchedule(id) {
  const { data } = await http.delete(`/schedule/${id}`);
  return data;
}

export async function generateSchedule(payload) {
  const { data } = await http.post('/schedule/generate', payload);
  return data;
}

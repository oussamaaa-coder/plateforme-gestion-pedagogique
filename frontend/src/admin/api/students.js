import { http } from './http';

export async function listStudents(params = {}) {
  const { data } = await http.get('/students', { params });
  return data;
}

export async function getStudent(id) {
  const { data } = await http.get(`/students/${id}`);
  return data;
}

export async function createStudent(payload) {
  const { data } = await http.post('/students', payload);
  return data;
}

export async function updateStudent(id, payload) {
  const { data } = await http.put(`/students/${id}`, payload);
  return data;
}

export async function deleteStudent(id) {
  const { data } = await http.delete(`/students/${id}`);
  return data;
}


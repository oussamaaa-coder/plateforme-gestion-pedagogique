import { http } from './http';

export async function listNotes(params = {}) {
  const { data } = await http.get('/notes', { params });
  return data;
}

export async function getNote(id) {
  const { data } = await http.get(`/notes/${id}`);
  return data;
}

export async function createNote(payload) {
  const { data } = await http.post('/notes', payload);
  return data;
}

export async function updateNote(id, payload) {
  const { data } = await http.put(`/notes/${id}`, payload);
  return data;
}

export async function deleteNote(id) {
  const { data } = await http.delete(`/notes/${id}`);
  return data;
}

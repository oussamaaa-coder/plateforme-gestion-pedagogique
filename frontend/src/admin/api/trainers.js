import { http } from './http';

export async function listTrainers(params = {}) {
  const { data } = await http.get('/trainers', { params });
  return data;
}

export async function getTrainer(id) {
  const { data } = await http.get(`/trainers/${id}`);
  return data;
}

export async function createTrainer(payload) {
  const { data } = await http.post('/trainers', payload);
  return data;
}

export async function updateTrainer(id, payload) {
  const { data } = await http.put(`/trainers/${id}`, payload);
  return data;
}

export async function deleteTrainer(id) {
  const { data } = await http.delete(`/trainers/${id}`);
  return data;
}

// Formateur-specific
export async function listMyGroupes(params = {}) {
  const { data } = await http.get('/formateur/groupes', { params });
  return data;
}

export async function listGroupStudents(groupeId, params = {}) {
  const { data } = await http.get(`/formateur/groupes/${groupeId}/students`, { params });
  return data;
}

export async function listGroupModules(groupeId, params = {}) {
  const { data } = await http.get(`/formateur/groupes/${groupeId}/modules`, { params });
  return data;
}


export async function getAssignments(trainerId) {
  const { data } = await http.get(`/trainers/${trainerId}/assignments`);
  return data;
}

export async function saveAssignments(trainerId, assignments) {
  const { data } = await http.post(`/trainers/${trainerId}/assignments`, { assignments });
  return data;
}

export async function listAssignments(params) {
  const { data } = await http.get('/assignments', { params });
  return data;
}

export async function sendMessageToStudent(payload) {
  const { data } = await http.post('/formateur/send-message', payload);
  return data;
}

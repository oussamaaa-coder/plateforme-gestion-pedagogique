import { http } from './http';

export async function getDashboardStats() {
  const { data } = await http.get('/dashboard/stats');
  return data;
}

export async function getStudentDashboard() {
  const { data } = await http.get('/student/dashboard');
  return data;
}

export async function getFormateurDashboard() {
  const { data } = await http.get('/formateur/dashboard');
  return data;
}

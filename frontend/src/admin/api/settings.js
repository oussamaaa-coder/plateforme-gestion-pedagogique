import { http } from './http';

export async function getUserSettings() {
  const { data } = await http.get('/user-settings');
  return data;
}

export async function updateUserSettings(payload) {
  const { data } = await http.put('/user-settings', payload);
  return data;
}

export async function getSiteSettings() {
  const { data } = await http.get('/site-settings');
  return data;
}

export async function updateSiteSettings(payload) {
  const { data } = await http.put('/site-settings', payload);
  return data;
}


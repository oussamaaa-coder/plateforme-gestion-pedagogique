import { http } from './http';

export async function getNotifications(params = {}) {
  const { data } = await http.get('/notifications', { params });
  return data;
}

export async function getUnreadCount() {
  const { data } = await http.get('/notifications/unread-count');
  return data;
}

export async function markAsRead(id) {
  const { data } = await http.post(`/notifications/${id}/mark-read`);
  return data;
}

export async function markAllAsRead() {
  const { data } = await http.post('/notifications/mark-all-read');
  return data;
}

// Admin-only
export async function createNotification(payload) {
  const { data } = await http.post('/notifications', payload);
  return data;
}

export async function broadcastNotification(payload) {
  const { data } = await http.post('/notifications/broadcast', payload);
  return data;
}

export async function deleteNotification(id) {
  const { data } = await http.delete(`/notifications/${id}`);
  return data;
}

export async function getAllNotifications(params = {}) {
  const { data } = await http.get('/notifications/all', { params });
  return data;
}

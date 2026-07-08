/**
 * Simple In-Memory Cache for API requests
 * Optimized for ISTA NTIC SYBA Student Portal
 */

const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes cache

export const apiCache = {
  get(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > TTL;
    if (isExpired) {
      cache.delete(key);
      return null;
    }
    return entry.data;
  },
  
  set(key, data) {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  clear(key) {
    if (key) cache.delete(key);
    else cache.clear();
  }
};

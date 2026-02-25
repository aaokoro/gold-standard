/**
 * In-memory fallback when Firebase is not configured. Data lasts for the app session only.
 */

const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

let reports = [];
let exchangePosts = [];
let nextPostId = 1;

export const mockLineCheck = {
  submitReport(locationName, isLong) {
    reports.push({
      locationName,
      isLong: !!isLong,
      timestamp: Date.now(),
    });
    return Promise.resolve(true);
  },

  getStats(locationName) {
    const now = Date.now();
    const recent = reports.filter(
      (r) => r.locationName === locationName && now - r.timestamp <= MAX_AGE_MS
    );
    return Promise.resolve({
      total: recent.length,
      longCount: recent.filter((r) => r.isLong).length,
    });
  },
};

export const mockExchange = {
  addPost({ title, body, type, contact }) {
    exchangePosts.unshift({
      id: `mock-${nextPostId++}`,
      title: (title || '').trim(),
      body: (body || '').trim(),
      type: type || 'sale',
      contact: (contact || '').trim(),
      timestamp: Date.now(),
    });
    return Promise.resolve(true);
  },

  getPosts() {
    return Promise.resolve(
      exchangePosts.map((p) => ({ ...p, timestamp: p.timestamp }))
    );
  },
};

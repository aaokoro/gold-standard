import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { mockLineCheck } from './mockStore';

const REPORTS_COLLECTION = 'reports';
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

export const LOCATIONS = {
  WILLIAMS_DINING: 'Williams Dining Hall',
  CHICKFILA: 'Chick-fil-A',
};

export async function submitLineReport(locationName, isLong) {
  if (!isFirebaseConfigured()) {
    return mockLineCheck.submitReport(locationName, isLong);
  }
  try {
    await addDoc(collection(db, REPORTS_COLLECTION), {
      locationName,
      isLong: !!isLong,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error('submitLineReport', e);
    return false;
  }
}

export async function getLineStats(locationName) {
  if (!isFirebaseConfigured()) {
    return mockLineCheck.getStats(locationName);
  }
  try {
    const ref = collection(db, REPORTS_COLLECTION);
    const q = query(
      ref,
      where('locationName', '==', locationName),
      orderBy('timestamp', 'desc'),
      limit(200)
    );
    const snapshot = await getDocs(q);
    const now = Date.now();
    let total = 0;
    let longCount = 0;
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const ts = data.timestamp?.toMillis?.() ?? 0;
      if (now - ts <= MAX_AGE_MS) {
        total += 1;
        if (data.isLong) longCount += 1;
      }
    });
    return { total, longCount };
  } catch (e) {
    console.error('getLineStats', e);
    return { total: 0, longCount: 0 };
  }
}

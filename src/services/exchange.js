import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { mockExchange } from './mockStore';

const EXCHANGE_COLLECTION = 'exchange';

export async function addPost({ title, body, type = 'sale', contact = '' }) {
  if (!isFirebaseConfigured()) {
    return mockExchange.addPost({ title, body, type, contact });
  }
  try {
    await addDoc(collection(db, EXCHANGE_COLLECTION), {
      title: (title || '').trim(),
      body: (body || '').trim(),
      type: type || 'sale',
      contact: (contact || '').trim(),
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error('addPost', e);
    return false;
  }
}

export async function getPosts(limitCount = 50) {
  if (!isFirebaseConfigured()) {
    return mockExchange.getPosts();
  }
  try {
    const ref = collection(db, EXCHANGE_COLLECTION);
    const q = query(ref, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis?.(),
    }));
  } catch (e) {
    console.error('getPosts', e);
    return [];
  }
}

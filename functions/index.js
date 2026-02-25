const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

/**
 * Delete line-check reports older than 1 hour. Runs every 30 minutes.
 * Keeps Firestore lean and the "last 30 min" stats accurate.
 */
exports.cleanupOldReports = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const snapshot = await db
      .collection('reports')
      .where('timestamp', '<', admin.firestore.Timestamp.fromDate(oneHourAgo))
      .limit(500)
      .get();

    if (snapshot.empty) return null;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Deleted ${snapshot.size} old report(s).`);
    return null;
  });

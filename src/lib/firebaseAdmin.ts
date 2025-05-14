import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../firebase-service-account.json')),
  });
}

export const db = admin.firestore();
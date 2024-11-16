const admin = require('firebase-admin');
const serviceAccount = require('./etic-46e76-firebase-adminsdk-7rw1c-f3e95d5687.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'etic.appspot.com' // replace with your bucket name
});

const bucket = admin.storage().bucket();

module.exports = { bucket };

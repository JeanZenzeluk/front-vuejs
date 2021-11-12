
importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js')

const firebaseConfig = {
  apiKey: '123...',
  authDomain: 'terapiapp...123',
  databaseURL: 'https://terapiapp...',
  projectId: 'terapiapp...',
  storageBucket: 'terapiapp...',
  messagingSenderId: '123...',
  appId: '1:132...',
  measurementId: 'G-123...'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

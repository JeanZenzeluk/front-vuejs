import firebase from 'firebase'

// <script src="https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js"></script>

var firebaseConfig = {
  apiKey: '...',
  authDomain: 'terapiapp-123...',
  databaseURL: 'https://...',
  projectId: 'terapiapp...',
  storageBucket: 'terapiapp...',
  messagingSenderId: '123...',
  appId: '1:123...',
  measurementId: 'G-123...'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default {
  messaging: firebase.messaging()
}

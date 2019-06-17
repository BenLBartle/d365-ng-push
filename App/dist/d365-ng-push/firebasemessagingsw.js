importScripts('https://www.gstatic.com/firebasejs/5.8.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.5/firebase-messaging.js');
firebase.initializeApp({
    'messagingSenderId': '1006523280491'
});

const messaging = firebase.messaging();
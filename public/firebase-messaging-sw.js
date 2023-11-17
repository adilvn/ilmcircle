importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');


const firebaseConfig = {
  apiKey: "AIzaSyB1JrSJaUMP5VtLfZJFy9qBSiZUA7v08Kg",
  authDomain: "ilm-circle-2ab93.firebaseapp.com",
  projectId: "ilm-circle-2ab93",
  storageBucket: "ilm-circle-2ab93.appspot.com",
  messagingSenderId: "50137630524",
  appId: "1:50137630524:web:4c0f46b29bc0e1dd2ec039",
  measurementId: "G-JDBH9BSJXT"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {


  const notificationTitle = payload.notification.title;
  const notificationOptions = { body: payload.notification.body };

  self.registration.showNotification(notificationTitle, notificationOptions);




  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(`https://ilm-circle.vercel.app`)
    );
  });
});


self.addEventListener('activate', (event) => {
  console.log('Activated service worker');
});

self.addEventListener('install', (event) => {
  console.log('Installed service worker');
});


















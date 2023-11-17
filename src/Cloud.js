import { initializeApp } from 'firebase/app';
import { getToken, getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB1JrSJaUMP5VtLfZJFy9qBSiZUA7v08Kg",
  authDomain: "ilm-circle-2ab93.firebaseapp.com",
  projectId: "ilm-circle-2ab93",
  storageBucket: "ilm-circle-2ab93.appspot.com",
  messagingSenderId: "50137630524",
  appId: "1:50137630524:web:4c0f46b29bc0e1dd2ec039",
  measurementId: "G-JDBH9BSJXT"
};





const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);


export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-push-notification-scope',
        });
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = async () => {
  await getOrRegisterServiceWorker()

  const token = await getToken(messaging, { vapidKey: 'BKwyzEjhywNnGJ6jEPJ4-sCA2RJHhRNdgUkFh89zqK90-9ibARLeNLL2DnW0nLmwCToiRUWuFOS4s-EA9ISW_Yw' });
  return token
}

export const messag = getMessaging(firebaseApp);

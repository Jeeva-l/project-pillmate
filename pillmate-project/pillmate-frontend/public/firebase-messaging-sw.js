/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyBbDRidO1PfCZAxDKdhZDM8e1lsxO8V-sk',
    authDomain: 'pillmate-b20b8.firebaseapp.com',
    projectId: 'pillmate-b20b8',
    storageBucket: 'pillmate-b20b8.firebasestorage.app',
    messagingSenderId: '859882061934',
    appId: '1:859882061934:web:85d69dbd1e4f846f00267f',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || 'PillMate reminder';
    const options = {
        body: payload.notification?.body || payload.data?.body || 'You have a new PillMate notification.',
        icon: '/images/pillmate-logo.png',
        data: {
            url: payload.data?.click_action || '/dashboard',
        },
    };

    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(url);
            }

            return null;
        })
    );
});

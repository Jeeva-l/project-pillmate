import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { registerPushToken } from './api';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
const placeholderVapidKey = 'your-web-push-certificate-key-pair-public-key';
const hasValidVapidKey = Boolean(vapidKey) && vapidKey !== placeholderVapidKey;

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean) && hasValidVapidKey;

let messagingInstance = null;

const getMessagingInstance = async () => {
    if (!hasFirebaseConfig || !(await isSupported())) {
        return null;
    }

    if (!messagingInstance) {
        const app = initializeApp(firebaseConfig);
        messagingInstance = getMessaging(app);
    }

    return messagingInstance;
};

export const registerBrowserPushNotifications = async (userId) => {
    return registerBrowserPushNotificationsWithOptions(userId, { requestPermission: true });
};

export const getBrowserNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return 'unsupported';
    }

    return Notification.permission;
};

export const registerBrowserPushNotificationsWithOptions = async (
    userId,
    { requestPermission = true } = {}
) => {
    if (!userId || !('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('Push registration skipped: browser does not support required APIs or user is missing.');
        return null;
    }

    if (!hasValidVapidKey) {
        console.warn(
            'Firebase push notifications are disabled: set REACT_APP_FIREBASE_VAPID_KEY to your Firebase Web Push certificate key pair public key.'
        );
        return null;
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
        console.warn('Push registration skipped: Firebase messaging is not available in this browser/context.');
        return null;
    }

    let permission = Notification.permission;
    if (permission !== 'granted' && requestPermission) {
        permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
        console.warn('Push registration skipped: notification permission is', permission);
        return null;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Firebase messaging service worker registered.');
    const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
    });

    if (token) {
        console.log('FCM token generated:', token);
        await registerPushToken(userId, token);
        console.log('FCM token sent to backend for user:', userId);
    } else {
        console.warn('FCM token was not returned by Firebase.');
    }

    return token;
};

export const listenForForegroundNotifications = async () => {
    const messaging = await getMessagingInstance();
    if (!messaging || !('Notification' in window)) {
        return () => {};
    }

    return onMessage(messaging, (payload) => {
        const title = payload.notification?.title || payload.data?.title || 'PillMate reminder';
        const body = payload.notification?.body || payload.data?.body || 'You have a new PillMate notification.';

        if (Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/images/pillmate-logo.png',
                data: {
                    url: payload.data?.click_action || '/dashboard',
                },
            });
        }
    });
};

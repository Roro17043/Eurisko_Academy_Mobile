import { OneSignal, LogLevel, NotificationClickEvent, NotificationWillDisplayEvent } from 'react-native-onesignal';

function onForegroundDisplay(event: NotificationWillDisplayEvent) {
  console.log('🔔 Foreground notification:', event);
//   event.preventDefault(); // Optional
}

function onNotificationClick(event: NotificationClickEvent) {
  console.log('📨 Notification clicked:', event.notification);
  // Optional: Navigate to screen or take action
}

export function initializeOneSignal() {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize('3f59a255-0fa9-46d1-8408-12c0d7ab02fa');
  OneSignal.Notifications.requestPermission(false);

const token = OneSignal.User.pushSubscription.getTokenAsync();
  console.log('🆔 OneSignal Push Token:', token);


  OneSignal.Notifications.addEventListener('foregroundWillDisplay', onForegroundDisplay);
  OneSignal.Notifications.addEventListener('click', onNotificationClick);
}

export function removeOneSignalListeners() {
  OneSignal.Notifications.removeEventListener('foregroundWillDisplay', onForegroundDisplay);
  OneSignal.Notifications.removeEventListener('click', onNotificationClick);
}

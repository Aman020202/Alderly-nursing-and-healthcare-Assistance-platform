// Browser Push Notification Service
// Requests permission and shows native browser notifications

export const requestPushPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showBrowserNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options
  });

  notification.onclick = () => {
    window.focus();
    if (options.link) {
      window.location.href = options.link;
    }
    notification.close();
  };

  // Auto close after 5 seconds
  setTimeout(() => notification.close(), 5000);
};

export default { requestPushPermission, showBrowserNotification };

import { NotificationManager } from 'react-notifications'

const Notification = (message, type = 'success', onNotification = () => {}) => {
  return () => {
    switch (type) {
      case 'info':
        return NotificationManager.info(message, 'Info', 5000, onNotification())
      case 'success':
        return NotificationManager.success(message, 'Success', 3000, onNotification())
      case 'warning':
        return NotificationManager.warning(message, 'Warning', 3000, onNotification())
      case 'error':
        return NotificationManager.error(message, 'Error', 3000, onNotification())
    }
  }
}

export default Notification

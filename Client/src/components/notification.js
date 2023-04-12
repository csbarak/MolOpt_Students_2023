import { NotificationManager } from 'react-notifications'

const Notification = (message, type = 'success', onNotification = () => {}) => {
  return () => {
    switch (type) {
      case 'info':
        return NotificationManager.info(message, 'Info', 2000, onNotification())
      case 'success':
        return NotificationManager.success(message, 'Success', 2000, onNotification())
      case 'warning':
        return NotificationManager.warning(message, 'Warning', 2000, onNotification())
      case 'error':
        return NotificationManager.error(message, 'Error', 2000, onNotification())
    }
  }
}

export default Notification

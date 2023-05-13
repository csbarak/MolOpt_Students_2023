import { NotificationManager } from 'react-notifications'

const Notification = (message, type = 'success', onNotification = () => {}, time=3000) => {
  return () => {
    switch (type) {
      case 'info':
        return NotificationManager.info(message, 'Info', time, onNotification())
      case 'success':
        return NotificationManager.success(message, 'Success', time, onNotification())
      case 'warning':
        return NotificationManager.warning(message, 'Warning', time, onNotification())
      case 'error':
        return NotificationManager.error(message, 'Error', time, onNotification())
    }
  }
}

export default Notification

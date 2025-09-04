import { useMessage } from 'pxd'

export function initNotification() {
  return new Promise(() => {
    Notification.requestPermission().then(status => {
      switch(status) {

      case 'default': {
        useMessage('Make sure the authority of \'Notifaction\' has been approved', {
          type: 'warning',
        })
      } break
      case 'denied': {
        useMessage('To guarantee the whole powers of Notice-Book, please approve the authority of \'Notifaction\'', {
          type: 'error',
        })
        return
      } break
      
      }
    })
  })
}
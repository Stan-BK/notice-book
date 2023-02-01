export function initNotification() {
  return new Promise(resolve => {
    Notification.requestPermission().then(status => {
      switch(status) {

      case 'default': {
        alert('To guarantee the whole powers of Notice-Book, please approve the authority of \'Notifaction\'')
        console.log('The permission request was dismissed.')
        return
      } break
      case 'denied': {
        alert('To guarantee the whole powers of Notice-Book, please approve the authority of \'Notifaction\'')
        console.log('Permission wasn\'t granted. Allow a retry.')
        return
      } break
      
      }
    })
  })
}
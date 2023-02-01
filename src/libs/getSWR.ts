export async function getSWR() {
  let swr = await navigator.serviceWorker.getRegistration('/src/sw.ts')

  if (swr == undefined) {
    swr = await navigator.serviceWorker.register('/src/sw.ts', {
      type: 'module'
    }).then(serviceWorkerRegistration => {
      return serviceWorkerRegistration
    }) as ServiceWorkerRegistration
  }

  return swr
}


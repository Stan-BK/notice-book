const SW = import.meta.env.MODE === 'production' ? '/notice-book/sw.ts' : '/src/sw.ts'

export async function getSWR() {
  let swr = await navigator.serviceWorker.getRegistration(SW)

  if (swr == undefined) {
    swr = await navigator.serviceWorker.register(SW, {
      type: 'module'
    }).then(serviceWorkerRegistration => {
      return serviceWorkerRegistration
    }) as ServiceWorkerRegistration
  }

  return swr
}


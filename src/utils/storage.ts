export function setStorage(key: string, value: object) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStorage(key: string): any[] {
  const list = localStorage.getItem(key)
  return list ? JSON.parse(list) : []
}
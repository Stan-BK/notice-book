declare global {
  interface ServiceWorkerGlobalScope {
      __WB_MANIFEST: Array<PrecacheEntry | string>;
  }
}
import { ref } from "vue";

const SW = import.meta.env.MODE === "production" ? "/sw.js" : "/src/sw.ts";

const SCOPE = import.meta.env.MODE === "production" ? "/" : "/src/";

export const SUBSCRIPTION_PATH = import.meta.env.VITE_SUBSCRIPTION_PATH ?? "";

let swr: ServiceWorkerRegistration | undefined;
let temporaryId: number;
export let endpoint: string | null;
export const isInstalled = ref(false);

// Process:
// 1. `checkSubscription`
// 2. if not installed, `registerServiceWorker`
// 3. if installed, `initPushManager`
// 4. if not subscribed, `subscribe`
// 5. if subscribed, `getEndpointFromStorage`

export async function checkSubscription() {
  swr = await navigator.serviceWorker.getRegistration(SW);
  if (swr) {
    const sub = await swr!.pushManager.getSubscription();
    if (sub) {
      getEndpointFromStorage();
      isInstalled.value = true;
    }
    return !!sub
  }
  return !!swr;
}

export async function initServiceWorker(): Promise<void> {
  if (!swr) {
    await registerServiceWorker();
  } else {
    await initPushManager();
  }
}

async function initPushManager() {
  const sub = await swr!.pushManager.getSubscription();

  if (sub) {
    getEndpointFromStorage();
    isInstalled.value = true;
  } else {
    await subscribe();
  }
}

export async function registerServiceWorker() {
  await navigator.serviceWorker
    .register(SW, {
      type: "module",
      scope: SCOPE,
    })
    .then(async (registration) => {
      swr = registration;

      return await subscribe();
    })
}

export async function subscribe() {
  const publicKey = urlBase64ToUint8Array(await generateVAPIDKeys());

  return swr!.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    })
    .then(async (sub) =>
      fetch(SUBSCRIPTION_PATH + "/subscribe", {
        method: "POST",
        body: JSON.stringify({
          temporaryId,
          subscription: sub,
        }),
      }).then(() => {
        endpoint = sub.endpoint;
        setEndpointToStorage();

        isInstalled.value = true;
      })
    );
}

export async function unsubscribe() {
  return swr!.pushManager
    .getSubscription()
    .then((sub) =>
      fetch(SUBSCRIPTION_PATH + "/unsubscribe", {
        method: "POST",
        body: JSON.stringify({
          endpoint: sub?.endpoint,
        }),
      }).then(() => {
        endpoint = null;
        isInstalled.value = false;
        sub!.unsubscribe();
        setEndpointToStorage();
      })
    )
}

async function generateVAPIDKeys() {
  return await fetch(SUBSCRIPTION_PATH + "/generateVAPIDKeys", {
    body: JSON.stringify((temporaryId = Date.now())),
    method: "POST",
  }).then(async (res) => await res.text());
}

function getEndpointFromStorage() {
  endpoint = localStorage.getItem("endpoint");
}

function setEndpointToStorage() {
  localStorage.setItem("endpoint", endpoint!);
}

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

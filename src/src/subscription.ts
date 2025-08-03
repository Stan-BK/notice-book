import { ref } from "vue";

const SW = import.meta.env.MODE === "production" ? "/sw.js" : "/src/sw.ts";

const SCOPE = import.meta.env.MODE === "production" ? "/" : "/src/";

export const SUBSCRIPTION_PATH = import.meta.env.VITE_SUBSCRIPTION_PATH ?? "";

let swr: ServiceWorkerRegistration;
let temporaryId: number;
export let endpoint: string | null;
export const isInstalled = ref(false);
export const isOperating = ref(false);

export async function SWR(): Promise<void> {
  swr = (await navigator.serviceWorker.getRegistration(SW))!;

  if (!swr) {
    initServiceWorker();
  } else {
    const sub = await swr.pushManager.getSubscription();

    if (sub) {
      getEndpointFromStorage();
      isInstalled.value = true;
    } else {
      subscribe();
    }
  }
}

export async function initServiceWorker() {
  const confirmSubscription = confirm("Do u want to Subscribe offline push?");
  if (!confirmSubscription) {
    return;
  }

  isOperating.value = true;

  await navigator.serviceWorker
    .register(SW, {
      type: "module",
      scope: SCOPE,
    })
    .then(async (registration) => {
      swr = registration;

      return await subscribe().catch((e) => {
        console.error("Service worker registration failed:", e);
      });
    })
    .finally(() => {
      isOperating.value = false;
    });
}

export async function subscribe() {
  const publicKey = urlBase64ToUint8Array(await generateVAPIDKeys());

  return swr.pushManager
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
  const confirmUnsubscribe = confirm("Do u want to Unsubscribe offline push?");
  if (!confirmUnsubscribe) {
    return;
  }
  isOperating.value = true;

  return swr.pushManager
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
    .finally(() => (isOperating.value = false));
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

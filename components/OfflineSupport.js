import React from "react";

export default function OfflineSupport() {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("service worker registered."))
        .catch(err => console.dir(err));

      let deferredPrompt;
      window.addEventListener("beforeinstallprompt", e => {
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        showInstallPromotion();
      });

      window.addEventListener("appinstalled", evt => {
        console.log("a2hs installed");
      });
    }
  }, []);

  return null;
}

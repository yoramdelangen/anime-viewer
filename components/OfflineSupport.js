import React from "react";

export default function OfflineSupport() {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("service worker registered."))
        .catch(err => console.dir(err));
    }
  }, []);

  return null;
}

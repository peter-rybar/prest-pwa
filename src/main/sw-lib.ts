// Register Service Worker.
export function swInit(): void {
    if ("serviceWorker" in navigator) {
        // Path is relative to the origin, not project root.
        navigator.serviceWorker.register("./sw.js")
            .then((registration) => {
                // console.log(reg);
                if (registration.installing) {
                    console.log("Service worker installing");
                } else if (registration.waiting) {
                    console.log("Service worker installed");
                } else if (registration.active) {
                    console.log("Service worker active");
                }
                console.log("Registration succeeded. Scope is " + registration.scope);
            })
            .catch((error) => {
                console.error("Registration failed with " + error);
            });
    }
}

export function showNotification(title: string, options?: NotificationOptions): void {
    if ((self as any).Notification) {
        console.log("Notification supported");
        Notification.requestPermission((result) => {
            if (result === "granted") {
                console.log("Notification permission granted");
                navigator.serviceWorker.ready.then((registration) => {
                    console.log("Notification SW ready");
                    registration.showNotification(title, options);
                });
            } else {
                console.warn("Notification permission:", result);
            }
        });
    } else {
        console.warn("Notification not supported");
    }
}

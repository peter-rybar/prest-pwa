// Register Service Worker.
export function swRegister(): void {
    if ("serviceWorker" in navigator) {
        // Path is relative to the origin, not project root.
        navigator.serviceWorker.register("./sw.js")
            .then(function (registration) {
                // console.log(reg);
                if (registration.installing) {
                    console.log("Service worker installing");
                } else if (registration.waiting) {
                    console.log("Service worker installed");
                } else if (registration.active) {
                    console.log("Service worker active");
                }
                showNotification(registration);
                console.log("Registration succeeded. Scope is " + registration.scope);
            })
            .catch(function (error) {
                console.error("Registration failed with " + error);
            });
    }
}

function showNotification(registration: any): void {
    if ((self as any).Notification) {
        console.warn("Notification not supported 1");
        Notification.requestPermission(function (result) {
            console.warn("Notification not supported 2", result);
            if (result === "granted") {
                console.warn("Notification not supported 3");
                // navigator.serviceWorker.ready.then(function (registration) {
                    console.warn("Notification not supported 4", navigator.serviceWorker);
                    registration.showNotification("Vibration Sample", {
                        body: "Buzz! Buzz!",
                        // icon: "../images/touch/chrome-touch-icon-192x192.png",
                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                        tag: "vibration-sample"
                    });
                // });
            }
        });
    } else {
        console.warn("Notification not supported");
    }
}

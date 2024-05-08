export const OnPush = async (event, self) => {
  const status = await navigator.permissions.query({
    // @ts-expect-error periodicsync is not included in the default SW interface.
    name: "periodic-background-sync"
  });

  if (status.state === "granted") {
  }
  const body = event.data.text() || "Push message has no payload";

  const options = {
    body,
    icon: "images/checkmark.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: "explore",
        title: "Explore this new world",
        icon: "images/checkmark.png"
      },
      {
        action: "close",
        title: "I don't want any of this",
        icon: "images/xmark.png"
      }
    ]
  };
  self.registration.showNotification("Notification via Server and Push API", options);
};

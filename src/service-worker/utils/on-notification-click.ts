export const OnNotificationClick = (event, clients) => {
  const eventAction = event.action;
  console.log("message event fired! event action is:", `'${eventAction}'`);

  if (eventAction !== "explore") {
    return;
  }

  const url = self.location.origin;
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
};

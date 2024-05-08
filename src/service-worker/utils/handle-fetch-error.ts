function handleFetch(event) {

  return caches.match(event.request).then(function(response) {
    if (response) {
      return response;
    }
    return fetch(event.request).then(function(response) {
      console.log("Response from network is:", response);
      return response;
    }).catch(function(error) {
      console.error("Fetching failed:", error);
      throw error;
    });
  });
}
export const HandleFetchError=(event)=>{
  event.respondWith(handleFetch(event));
}

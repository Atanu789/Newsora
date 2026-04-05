async function triggerUserNotification(payload) {
  // Integrate Firebase Cloud Messaging here using firebase-admin.
  // This is a production-ready seam for wiring queued notification events.
  return {
    delivered: false,
    reason: 'FCM provider not configured yet',
    payload
  };
}

module.exports = {
  triggerUserNotification
};

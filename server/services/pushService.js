// Mock Push Notification Service
// In production, use web-push library with VAPID keys

export const sendPushNotification = async (userId, payload) => {
  console.log(`\n========== MOCK PUSH ==========`);
  console.log(`To User: ${userId}`);
  console.log(`Title: ${payload.title}`);
  console.log(`Body: ${payload.body}`);
  console.log(`Link: ${payload.link || 'N/A'}`);
  console.log(`===============================\n`);

  return { success: true };
};

export default { sendPushNotification };

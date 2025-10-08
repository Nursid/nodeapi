// fcp_token.js - Firebase Cloud Messaging (FCM) integration for service providers
const { JWT } = require("google-auth-library");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const db = require("../model/index");
const ServiceProviderModel = db.ServiceProviderModel;


// Path to your Firebase service account JSON key
const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, "service", "serviceAccountKey.json");

// Load service account JSON
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, "utf8"));

// Get access token
async function getAccessToken() {
  const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"]
  });

  const tokens = await client.authorize();
  return tokens.access_token;
}

// Get FCM token from service provider ID
async function getFCMTokenByServiceProviderId(serviceProviderId) {
  try {
    const serviceProvider = await ServiceProviderModel.findOne({ 
      where: { id: serviceProviderId } 
    });
    
    if (!serviceProvider) {
      throw new Error(`Service provider with ID ${serviceProviderId} not found`);
    }
    
    if (!serviceProvider.fcm_token) {
      throw new Error(`FCM token not found for service provider ID ${serviceProviderId}`);
    }
    
    return serviceProvider.fcm_token;
  } catch (error) {
    console.error("Error fetching FCM token:", error);
    throw error;
  }
}

// Send notification
async function sendNotification(token, order_no, service_name, serviceProviderId) {
  try {
    const accessToken = await getAccessToken();

    const url = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

    const message = {
    //   message: {
    //     token: token, // Device FCM registration token
    //     notification: {
    //       title: title,
    //       body: body,
    //     },
    //   },

        "message": {
          "token": token,
          "data": {
            "title": service_name,
            "body": `New Order ${order_no} has been placed, please accept or reject it.`,
            "screen": "home",
            "order_no": String(order_no),
            "service_provider_id": String(serviceProviderId),
          },
          "android": {
            "priority": "high"
          }
        }
    };

    const response = await axios.post(url, message, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("FCM Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    
    // Handle axios error response
    if (error.response) {
      throw new Error(`FCM API Error: ${error.response.data?.error?.message || 'Unknown error'}`);
    } else {
      throw error;
    }
  }
}

// Send notification to service provider by ID
async function sendNotificationToServiceProvider(serviceProviderId, order_no, service_name) {

  try {
    const fcmToken = await getFCMTokenByServiceProviderId(serviceProviderId);
    return await sendNotification(fcmToken, order_no, service_name, serviceProviderId);
  } catch (error) {
    console.error("Error sending notification to service provider:", error);
    throw error;
  }
}   

// Export functions for use in other modules
module.exports = {
  getAccessToken,
  getFCMTokenByServiceProviderId,
  sendNotification,
  sendNotificationToServiceProvider
};

// Example usage - Uncomment to test
/*
(async () => {
  try {
    // Example 1: Send notification using service provider ID
    await sendNotificationToServiceProvider(1, "Hello from Node.js!", "This is a push notification test 🚀");
    
    // Example 2: Send notification using direct FCM token
    const fcmToken = await getFCMTokenByServiceProviderId(1);
    await sendNotification(fcmToken, "Direct Token Test", "Testing direct token usage 📱");
    
  } catch (error) {
    console.error("Error in example:", error);
  }
})();
*/

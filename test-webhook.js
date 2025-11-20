// Test script to verify Clerk webhook integration
// Run this with: node test-webhook.js

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const WEBHOOK_ENDPOINT = `${STRAPI_URL}/api/user-resumes/clerk-webhook`;

// Sample Clerk user.created webhook payload
const samplePayload = {
  type: 'user.created',
  data: {
    id: 'user_test123',
    email_addresses: [
      {
        id: 'email_test123',
        email_address: 'test@example.com',
      },
    ],
    primary_email_address_id: 'email_test123',
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
  },
};

async function testWebhook() {
  console.log('🧪 Testing Clerk webhook endpoint...\n');
  console.log('Endpoint:', WEBHOOK_ENDPOINT);
  console.log('Payload:', JSON.stringify(samplePayload, null, 2));
  console.log('\n⚠️  Note: This will fail signature verification (expected)');
  console.log('This is just to test if the endpoint is reachable.\n');

  try {
    const response = await axios.post(WEBHOOK_ENDPOINT, samplePayload, {
      headers: {
        'Content-Type': 'application/json',
        // These headers would normally be added by Clerk
        'svix-id': 'test-id',
        'svix-timestamp': Date.now().toString(),
        'svix-signature': 'test-signature',
      },
    });

    console.log('✅ Response:', response.status, response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Error Response:', error.response.status, error.response.data);
      
      if (error.response.status === 400 && error.response.data.error === 'Invalid signature') {
        console.log('\n✅ Endpoint is working! (Signature verification is functioning correctly)');
        console.log('Now configure the webhook in Clerk dashboard to send real events.');
      }
    } else {
      console.error('❌ Request failed:', error.message);
      console.log('\n⚠️  Make sure Strapi is running on', STRAPI_URL);
    }
  }
}

testWebhook();

'use strict';

/**
 * Clerk webhook controller
 */

const { Webhook } = require('svix');

module.exports = {
  async handleWebhook(ctx) {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        ctx.status = 500;
        ctx.body = { error: 'Webhook secret not configured' };
        return;
      }

      // Get the headers
      const svix_id = ctx.request.headers['svix-id'];
      const svix_timestamp = ctx.request.headers['svix-timestamp'];
      const svix_signature = ctx.request.headers['svix-signature'];

      // If there are no headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        ctx.status = 400;
        ctx.body = { error: 'Missing svix headers' };
        return;
      }

      // Get the body
      const payload = ctx.request.body;
      const body = JSON.stringify(payload);

      // Create a new Svix instance with your webhook secret
      const wh = new Webhook(WEBHOOK_SECRET);

      let evt;

      // Verify the webhook signature
      try {
        evt = wh.verify(body, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        });
      } catch (err) {
        console.error('Error verifying webhook:', err);
        ctx.status = 400;
        ctx.body = { error: 'Invalid signature' };
        return;
      }

      // Handle the webhook
      const { type, data } = evt;

      console.log('Clerk webhook received:', type);

      if (type === 'user.created') {
        // Extract user data from Clerk
        const {
          id: clerkUserId,
          email_addresses,
          first_name,
          last_name,
          username,
        } = data;

        const primaryEmail = email_addresses?.find(
          (email) => email.id === data.primary_email_address_id
        );

        const userEmail = primaryEmail?.email_address;
        const userName = `${first_name || ''} ${last_name || ''}`.trim() || username || 'User';

        console.log('Creating user profile for:', userEmail);

        // Check if user already exists in Strapi
        const existingUsers = await strapi.entityService.findMany(
          'api::user-resume.user-resume',
          {
            filters: { userEmail: userEmail },
            limit: 1,
          }
        );

        if (existingUsers && existingUsers.length > 0) {
          console.log('User already exists in Strapi:', userEmail);
          ctx.status = 200;
          ctx.body = { message: 'User already exists' };
          return;
        }

        // Create a default resume/profile for the new user
        // This is optional - you can skip this and just log the user
        // For now, we'll just acknowledge the webhook
        console.log('New user registered:', {
          clerkUserId,
          userEmail,
          userName,
        });

        // You could create a default user profile here if needed
        // await strapi.entityService.create('api::user-resume.user-resume', {
        //   data: {
        //     title: 'My First Resume',
        //     userEmail: userEmail,
        //     userName: userName,
        //     publishedAt: new Date(),
        //   },
        // });

        ctx.status = 200;
        ctx.body = { message: 'User webhook processed successfully' };
      } else if (type === 'user.updated') {
        console.log('User updated:', data.id);
        ctx.status = 200;
        ctx.body = { message: 'User update acknowledged' };
      } else {
        console.log('Unhandled webhook type:', type);
        ctx.status = 200;
        ctx.body = { message: 'Webhook received' };
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  },
};
